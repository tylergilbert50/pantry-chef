import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useIsFocused } from "@react-navigation/native";
import colors from "../../theme/colors";
import { IngredientForm } from "./components/IngredientForm";
import { useUser } from "../../context/UserContext";
import {
  normalizeName,
  lookupBarcode,
  SpoonacularProduct,
  IngredientInsert,
} from "../../services/apiService";
import {
  addIngredient,
  deleteAllPantryIngredients,
} from "@/services/ingredientService";

const SCAN_BOX_WIDTH = 280;
const SCAN_BOX_HEIGHT = 160;

export function Barcode() {
  const isFocused = useIsFocused();

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedValue, setScannedValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<SpoonacularProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { profile } = useUser();

  const addDefaultIngredients = async () => {
    const pantryId = profile?.pantry_id;
    if (!pantryId) {
      console.error("Error", "No pantry found for your account.");
      return;
    }
    console.log("Deleting pantry ingredients...");
    await deleteAllPantryIngredients(pantryId);

    const defaults: IngredientInsert[] = [
      {
        pantry_id: pantryId,
        spoonacular_id: "20081",
        name_product: "Flour",
        name_normalized: normalizeName("flour"),
        category: "Dry",
        quantity: 1,
        unit: "lb",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/flour.png",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "1123",
        name_product: "Eggs",
        name_normalized: normalizeName("Eggs"),
        category: "Meat",
        quantity: 12,
        unit: "each",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/egg.png",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "2047",
        name_product: "Salt",
        name_normalized: normalizeName("Salt"),
        category: "Dry",
        quantity: 32,
        unit: "oz",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/salt.jpg",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "19335",
        name_product: "Sugar",
        name_normalized: normalizeName("Sugar"),
        category: "Dry",
        quantity: 32,
        unit: "oz",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/sugar-in-bowl.png",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "18369",
        name_product: "Baking Powder",
        name_normalized: normalizeName("Baking Powder"),
        category: "Dry",
        quantity: 32,
        unit: "oz",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/white-powder.jpg",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "1077",
        name_product: "Milk",
        name_normalized: normalizeName("Milk"),
        category: "Dairy",
        quantity: 32,
        unit: "oz",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/milk.png",
      },
      {
        pantry_id: pantryId,
        spoonacular_id: "2050",
        name_product: "vanilla extract",
        name_normalized: normalizeName("vanilla extract"),
        category: "Fruit",
        quantity: 16,
        unit: "oz",
        expiration_date: null,
        image: "https://img.spoonacular.com/ingredients_250x250/vanilla-extract.jpg",
      },
    ];

    try {
      for (const ingredient of defaults) {
        const { error } = await addIngredient(ingredient);
        if (error) throw error;
      }
      console.log("Default ingredients added!");
    } catch (err: any) {
      console.error("Error", err.message || "Failed to add default ingredients.");
    }
     };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (loading) return;
    if (data === "5901234123457") {
      // Add default ingredients
      setScannedValue(data);
      setLoading(true);
      setShowForm(true);
      console.log("Adding default ingredients...");
      await addDefaultIngredients();
      setLoading(false);
      return;
    }
    setScannedValue(data);
    setLoading(true);
    setError(null);
    try {
      const result = await lookupBarcode(data);
      setProduct(result);
      setShowForm(true);
    } catch {
      setError("Could not find product. You can add it manually.");
    } finally {
      setLoading(false);
    }
  };

  const resetScan = () => {
    setScannedValue(null);
    setError(null);
    setProduct(null);
    setShowForm(false);
  };

  const openManualForm = () => {
    setProduct(null);
    setShowForm(true);
  };

  if (hasPermission === null)
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );

  if (!hasPermission)
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      {isFocused && <StatusBar style="light" translucent />}

      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        barcodeScannerSettings={{
          barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
        }}
        onBarcodeScanned={scannedValue ? undefined : handleBarCodeScanned}
      />

      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanBox} />
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay} />
      </View>

      <Text style={styles.scanText}>Scan a barcode</Text>

      <TouchableOpacity style={styles.button} onPress={openManualForm}>
        <Text style={styles.buttonText}>Manually Add</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={17} color={colors.secondary} />
        </View>
      </TouchableOpacity>

      {scannedValue && loading && (
        <View style={styles.resultContainer}>
          <ActivityIndicator size="small" color={colors.secondary} />
          <Text style={styles.lookupText}>Looking up product...</Text>
        </View>
      )}

      {scannedValue && error && (
        <View style={styles.resultContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
            <Text style={styles.scanAgainText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showForm}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={resetScan}
      >
        <IngredientForm product={product} onDone={resetScan} />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: { ...StyleSheet.absoluteFillObject, justifyContent: "center" },
  topOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  middleRow: { flexDirection: "row", height: SCAN_BOX_HEIGHT },
  sideOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  bottomOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)" },
  scanBox: {
    width: SCAN_BOX_WIDTH,
    height: SCAN_BOX_HEIGHT,
    borderWidth: 3,
    borderColor: colors.white,
    borderRadius: 12,
  },
  scanText: {
    position: "absolute",
    bottom: 275,
    alignSelf: "center",
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },
  button: {
    marginTop: 125,
    alignSelf: "center",
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    paddingLeft: 24,
    paddingRight: 14,
    borderRadius: 30,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  buttonText: { color: colors.white, fontSize: 18, fontWeight: "600" },
  iconCircle: {
    width: 18,
    height: 18,
    borderRadius: 14,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  resultContainer: {
    position: "absolute",
    bottom: 100,
    alignSelf: "center",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    minWidth: 200,
  },
  lookupText: { fontSize: 14, color: "gray", marginTop: 8 },
  errorText: { fontSize: 14, color: "red", textAlign: "center" },
  scanAgainButton: {
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  scanAgainText: { color: colors.white, fontSize: 14, fontWeight: "600" },
});
