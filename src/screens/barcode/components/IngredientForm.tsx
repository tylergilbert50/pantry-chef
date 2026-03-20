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
} from "react-native";
import colors from "../../../theme/colors";
import { addIngredient } from "../../../services/ingredientService";
import { useUser } from "../../../context/UserContext";
import {
  normalizeName,
  SpoonacularProduct,
  IngredientInsert,
  mapAisleToCategory,
} from "../components/barcodeApi";

interface IngredientFormProps {
  product?: SpoonacularProduct | null;
  onDone: () => void;
}

export function IngredientForm({ product, onDone }: IngredientFormProps) {
  const { profile } = useUser();
  const pantryId = profile?.pantry_id;

  const [nameProduct, setNameProduct] = useState(product?.title ?? "");
  const [category, setCategory] = useState(
    product ? mapAisleToCategory(product.aisle) : "",
  );
  const [quantity, setQuantity] = useState("1");
  const [unit, setUnit] = useState("");
  const [expirationDate, setExpirationDate] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!pantryId) {
      Alert.alert("Error", "No pantry found for your account.");
      return;
    }
    if (!nameProduct.trim()) {
      Alert.alert("Missing Info", "Product name is required.");
      return;
    }
    if (!category.trim()) {
      Alert.alert("Missing Info", "Category is required.");
      return;
    }
    if (!quantity.trim() || isNaN(Number(quantity)) || Number(quantity) <= 0) {
      Alert.alert("Missing Info", "Enter a valid quantity.");
      return;
    }
    if (!unit.trim()) {
      Alert.alert(
        "Missing Info",
        "Unit is required (e.g. lb, oz, count, bag).",
      );
      return;
    }

    const ingredient: IngredientInsert = {
      pantry_id: pantryId,
      name_normalized: normalizeName(nameProduct),
      name_product: nameProduct.trim(),
      category: category.trim(),
      quantity: Number(quantity),
      unit: unit.trim().toLowerCase(),
      expiration_date: expirationDate.trim() || null,
      flag: null,
    };

    setSaving(true);
    const { error: saveError } = await addIngredient(ingredient);
    setSaving(false);

    if (saveError) {
      Alert.alert("Error", saveError.message);
    } else {
      Alert.alert("Added!", `${nameProduct} has been added to your pantry.`, [
        { text: "Scan Another", onPress: onDone },
      ]);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.formContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.formScroll}>
        <Text style={styles.formTitle}>Add to Pantry</Text>

        <Text style={styles.fieldLabel}>Product Name</Text>
        <TextInput
          style={styles.fieldInput}
          value={nameProduct}
          onChangeText={setNameProduct}
          placeholder="e.g. Barilla Penne"
        />

        <Text style={styles.fieldLabel}>Category</Text>
        <TextInput
          style={styles.fieldInput}
          value={category}
          onChangeText={setCategory}
          placeholder="e.g. Grain, Protein, Dairy"
        />

        <View style={styles.row}>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>Quantity</Text>
            <TextInput
              style={styles.fieldInput}
              value={quantity}
              onChangeText={setQuantity}
              keyboardType="numeric"
              placeholder="e.g. 2"
            />
          </View>
          <View style={styles.halfField}>
            <Text style={styles.fieldLabel}>Unit</Text>
            <TextInput
              style={styles.fieldInput}
              value={unit}
              onChangeText={setUnit}
              placeholder="e.g. lb, oz, count"
            />
          </View>
        </View>

        <Text style={styles.fieldLabel}>Expiration Date (optional)</Text>
        <TextInput
          style={styles.fieldInput}
          value={expirationDate}
          onChangeText={setExpirationDate}
          placeholder="YYYY-MM-DD"
        />

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.buttonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Add to Pantry</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={onDone}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
    backgroundColor: colors.background,
  },
  row: { flexDirection: "row", gap: 12 },
  halfField: { flex: 1 },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonDisabled: { opacity: 0.5 },
  saveButtonText: { color: colors.white, fontSize: 17, fontWeight: "700" },
  cancelButton: { alignItems: "center", marginTop: 16, marginBottom: 40 },
  cancelButtonText: { color: "#999", fontSize: 15, fontWeight: "600" },
});
