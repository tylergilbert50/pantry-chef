import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Camera, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";

const SCAN_BOX_WIDTH = 280;
const SCAN_BOX_HEIGHT = 160;

export function Barcode() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scannedValue, setScannedValue] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScannedValue(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.center}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.center}>
        <Text>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
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

      <TouchableOpacity style={styles.button} onPress={() => {}}>
        <Text style={styles.buttonText}>Manually Add</Text>
        <View style={styles.iconCircle}>
          <Ionicons name="add" size={17} color={colors.secondary} />
        </View>
      </TouchableOpacity>

      {scannedValue && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Barcode</Text>
          <Text style={styles.resultText}>{scannedValue}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
  },
  topOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  middleRow: {
    flexDirection: "row",
    height: SCAN_BOX_HEIGHT,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
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
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "600",
  },
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
  },
  resultLabel: {
    fontSize: 14,
    color: "gray",
  },
  resultText: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 6,
  },
});
