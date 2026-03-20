import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
}: Props) {
  const isDisabled = quantity <= 1;

  return (
    <View style={styles.container}>
      {/* Decrease */}
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.disabled]}
        onPress={onDecrease}
        activeOpacity={0.7}
        disabled={isDisabled}
      >
        <Ionicons name="remove" size={18} color={colors.black} />
      </TouchableOpacity>

      {/* Quantity */}
      <Text style={styles.quantity}>{quantity}</Text>

      {/* Increase */}
      <TouchableOpacity
        style={styles.button}
        onPress={onIncrease}
        activeOpacity={0.7}
      >
        <Ionicons name="add" size={18} color={colors.black} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  quantity: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "center",
    marginHorizontal: 8,
    color: colors.black,
  },
});
