import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import colors from "../../../theme/colors";
import { Ionicons } from "@expo/vector-icons";
import {
  addIngredient,
  updateIngredient,
} from "../../../services/ingredientService";
import { useUser } from "../../../context/UserContext";
import {
  normalizeName,
  SpoonacularProduct,
  IngredientInsert,
  mapAisleToCategory,
  searchIngredientImage,
} from "../../../services/apiService";
import { UNITS, Unit } from "../../../../types/units";
import { CATEGORIES, Category } from "../../../../types/categories";

type PantryIngredient = {
  id?: string;
  ingredient_id?: number;
  name?: string;
  name_product?: string;
  quantity: number;
  unit: string;
  category: string;
  amount?: string;
  item_count?: number;
  image?: string;
  expirationDate?: string;
  expiration_date?: string | null;
};

interface IngredientFormProps {
  product?: SpoonacularProduct | null;
  existingIngredient?: PantryIngredient | null;
  onDone: () => void;
}

const formatDateInput = (text: string) => {
  const cleaned = text.replace(/\D/g, "").slice(0, 8);

  let formatted = cleaned;

  if (cleaned.length > 4) {
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }
  if (cleaned.length > 6) {
    formatted = `${cleaned.slice(0, 4)}-${cleaned.slice(4, 6)}-${cleaned.slice(6)}`;
  }

  return formatted;
};

export function IngredientForm({
  product,
  existingIngredient,
  onDone,
}: IngredientFormProps) {
  const { profile } = useUser();
  const pantryId = profile?.pantry_id;

  const isEditing = !!existingIngredient;

  const [nameProduct, setNameProduct] = useState(
    existingIngredient?.name_product ??
      existingIngredient?.name ??
      product?.title ??
      "",
  );

  const [category, setCategory] = useState<Category | "">(
    (existingIngredient?.category as Category) ??
      (product ? mapAisleToCategory(product.aisle) : ""),
  );

  const [quantity, setQuantity] = useState(
    existingIngredient ? String(existingIngredient.quantity) : "",
  );

  const [unit, setUnit] = useState<Unit>(
    (existingIngredient?.unit as Unit) ?? "oz",
  );

  const [expirationDate, setExpirationDate] = useState(
    existingIngredient?.expiration_date ??
      existingIngredient?.expirationDate ??
      "",
  );

  const [itemCount, setItemCount] = useState(
    existingIngredient ? String(existingIngredient.item_count ?? 1) : "1",
  );

  const [saving, setSaving] = useState(false);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);

  const [errors, setErrors] = useState({
    nameProduct: false,
    category: false,
    quantity: false,
    itemCount: false,
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const resetForm = () => {
    setNameProduct("");
    setCategory("");
    setQuantity("");
    setUnit("oz");
    setItemCount("1");
    setExpirationDate("");
    setErrors({
      nameProduct: false,
      category: false,
      quantity: false,
      itemCount: false,
    });
    setShowUnitDropdown(false);
    setShowCategoryDropdown(false);
  };

  const handleSave = async () => {
    if (!pantryId) {
      Alert.alert("Error", "No pantry found for your account.");
      return;
    }

    const newErrors = {
      nameProduct: !nameProduct.trim(),
      category: !category,
      quantity:
        !quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0,
      itemCount:
        !itemCount.trim() ||
        isNaN(Number(itemCount)) ||
        Number(itemCount) < 1 ||
        !Number.isInteger(Number(itemCount)),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    if (expirationDate) {
      const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(expirationDate);
      if (!isValidDate) {
        Alert.alert("Invalid Date", "Please use format YYYY-MM-DD.");
        return;
      }
    }

    setSaving(true);

    if (isEditing) {
      const updates = {
        name_product: nameProduct.trim(),
        name_normalized: normalizeName(nameProduct),
        category: category,
        quantity: Number(quantity),
        unit: unit,
        item_count: Number(itemCount),
        expiration_date: expirationDate.trim() || null,
      };

      const { error: updateError } = await updateIngredient(
        Number(existingIngredient.ingredient_id ?? existingIngredient.id),
        pantryId,
        updates,
      );

      setSaving(false);

      if (updateError) {
        Alert.alert("Error", updateError.message);
      } else {
        onDone();
      }
    } else {
      let imageUrl: string | null = product?.image ?? null;

      if (!imageUrl) {
        const searched = await searchIngredientImage(
          normalizeName(nameProduct),
        );
        imageUrl = searched ?? null;
      }

      const ingredient: IngredientInsert = {
        pantry_id: pantryId,
        name_normalized: normalizeName(nameProduct),
        name_product: nameProduct.trim(),
        category: category,
        quantity: Number(quantity),
        unit: unit,
        item_count: Number(itemCount),
        expiration_date: expirationDate.trim() || null,
        flag: null,
        image: imageUrl,
      };

      const { error: saveError } = await addIngredient(ingredient);

      setSaving(false);

      if (saveError) {
        Alert.alert("Error", saveError.message);
      } else {
        setSuccessMessage(`${nameProduct.trim()} added!`);
        setTimeout(() => setSuccessMessage(null), 2000);
        resetForm();
      }
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        style={styles.formContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.formScroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.formTitle}>
            {isEditing ? "Edit Ingredient" : "Add to Pantry"}
          </Text>

          {successMessage && (
            <View style={styles.successBanner}>
              <Ionicons name="checkmark-circle" size={18} color="#fff" />
              <Text style={styles.successText}>{successMessage}</Text>
            </View>
          )}

          <Text style={styles.fieldLabel}>
            Product Name{" "}
            {errors.nameProduct && <Text style={styles.error}>*</Text>}
          </Text>
          <TextInput
            style={[styles.fieldInput, errors.nameProduct && styles.inputError]}
            value={nameProduct}
            onChangeText={setNameProduct}
            placeholder="-"
            placeholderTextColor="#888"
          />

          <Text style={styles.fieldLabel}>
            Category {errors.category && <Text style={styles.error}>*</Text>}
          </Text>
          <View style={styles.dropdownWrapper}>
            <TouchableOpacity
              style={[styles.dropdown, errors.category && styles.inputError]}
              onPress={() => setShowCategoryDropdown(!showCategoryDropdown)}
            >
              <Text style={styles.dropdownText}>{category || "-"}</Text>
            </TouchableOpacity>

            {showCategoryDropdown && (
              <ScrollView
                style={styles.dropdownMenu}
                nestedScrollEnabled
                keyboardShouldPersistTaps="handled"
              >
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={styles.dropdownItem}
                    onPress={() => {
                      setCategory(c);
                      setShowCategoryDropdown(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <Text style={styles.fieldLabel}>
            Quantity {errors.quantity && <Text style={styles.error}>*</Text>}
          </Text>
          <View style={styles.row}>
            <TextInput
              style={[
                styles.fieldInput,
                styles.quantityInput,
                errors.quantity && styles.inputError,
              ]}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="decimal-pad"
              placeholder="-"
              placeholderTextColor="#888"
            />

            <View style={styles.dropdownWrapper}>
              <TouchableOpacity
                style={styles.dropdown}
                onPress={() => setShowUnitDropdown(!showUnitDropdown)}
              >
                <Text style={styles.dropdownText}>{unit}</Text>
              </TouchableOpacity>

              {showUnitDropdown && (
                <ScrollView
                  style={styles.dropdownMenu}
                  nestedScrollEnabled
                  keyboardShouldPersistTaps="handled"
                >
                  {UNITS.map((u) => (
                    <TouchableOpacity
                      key={u}
                      style={styles.dropdownItem}
                      onPress={() => {
                        setUnit(u);
                        setShowUnitDropdown(false);
                      }}
                    >
                      <Text style={styles.dropdownItemText}>{u}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          </View>

          <Text style={styles.fieldLabel}>
            Item Count {errors.itemCount && <Text style={styles.error}>*</Text>}
          </Text>
          <TextInput
            style={[styles.fieldInput, errors.itemCount && styles.inputError]}
            value={itemCount}
            onChangeText={setItemCount}
            keyboardType="number-pad"
            placeholder="1"
            placeholderTextColor="#888"
          />

          <Text style={styles.fieldLabel}>Expiration Date (optional)</Text>
          <TextInput
            style={styles.fieldInput}
            value={expirationDate}
            onChangeText={(text) => {
              const formatted = formatDateInput(text);
              setExpirationDate(formatted);
            }}
            placeholder="-"
            keyboardType="number-pad"
            maxLength={10}
            placeholderTextColor="#888"
          />

          <TouchableOpacity
            style={[styles.saveButton, saving && styles.buttonDisabled]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text style={styles.saveButtonText}>
                {isEditing ? "Save Changes" : "Add to Pantry"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={onDone}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  formContainer: { flex: 1, backgroundColor: colors.white },
  formScroll: { padding: 24, paddingTop: 100 },
  formTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#333",
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginTop: 12,
  },
  fieldInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  inputError: {
    borderColor: "red",
  },
  error: {
    color: "red",
    fontWeight: "700",
  },
  row: { flexDirection: "row", gap: 12, alignItems: "center" },
  quantityInput: { flex: 1 },
  dropdownWrapper: { flex: 1 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    backgroundColor: "#f9f9f9",
  },
  dropdownText: { fontSize: 16, color: "#333" },
  dropdownMenu: {
    position: "absolute",
    top: 55,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    zIndex: 10,
    maxHeight: 200,
  },
  dropdownItem: { padding: 12 },
  dropdownItemText: { fontSize: 16 },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 80,
  },
  buttonDisabled: { opacity: 0.5 },
  saveButtonText: { color: colors.white, fontSize: 17, fontWeight: "700" },
  cancelButton: { alignItems: "center", marginTop: 16, marginBottom: 40 },
  cancelButtonText: { color: "#999", fontSize: 15, fontWeight: "600" },
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.secondary,
    borderRadius: 10,
    padding: 12,
    gap: 8,
    marginBottom: 8,
  },
  successText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
