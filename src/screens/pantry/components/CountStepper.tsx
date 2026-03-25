import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onQuantityChange?: (value: number) => void;
};

export default function QuantityStepper({
  quantity,
  onIncrease,
  onDecrease,
  onQuantityChange,
}: Props) {
  const isDisabled = quantity <= 1;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(quantity));
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!editing) {
      setDraft(String(quantity));
    }
  }, [quantity, editing]);

  const startEditing = () => {
    setDraft(String(quantity));
    setEditing(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  };

  const commitValue = () => {
    setEditing(false);
    const parsed = parseInt(draft, 10);
    if (!isNaN(parsed) && parsed >= 1 && onQuantityChange) {
      onQuantityChange(parsed);
    } else {
      setDraft(String(quantity));
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isDisabled && styles.disabled]}
        onPress={onDecrease}
        activeOpacity={0.7}
        disabled={isDisabled}
      >
        <Ionicons name="remove" size={18} color={colors.black} />
      </TouchableOpacity>

      {editing ? (
        <TextInput
          ref={inputRef}
          style={styles.quantityInput}
          value={draft}
          onChangeText={setDraft}
          onBlur={commitValue}
          onSubmitEditing={commitValue}
          keyboardType="number-pad"
          selectTextOnFocus
        />
      ) : (
        <TouchableOpacity onPress={startEditing} activeOpacity={0.6}>
          <Text style={styles.quantity}>{quantity}</Text>
        </TouchableOpacity>
      )}

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
  quantityInput: {
    fontSize: 18,
    fontWeight: "600",
    minWidth: 28,
    textAlign: "center",
    marginHorizontal: 8,
    color: colors.black,
    borderBottomWidth: 1.5,
    borderBottomColor: colors.white,
    paddingVertical: 0,
  },
});
