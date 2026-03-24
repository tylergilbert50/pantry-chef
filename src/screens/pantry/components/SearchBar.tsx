import React from "react";
import { View, TextInput, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type Props = {
  value: string;
  onChange: (text: string) => void;
  onFilterPress?: () => void;
};

export function PantrySearchBar({ value, onChange, onFilterPress }: Props) {
  return (
    <View style={styles.container}>
      {/* Left Icon */}
      <Ionicons name="search" size={20} color="#999" />

      {/* Input */}
      <TextInput
        style={styles.input}
        placeholder="Search ingredients..."
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChange}
      />

      {/* Filter Button */}
      <TouchableOpacity onPress={onFilterPress}>
        <Ionicons name="options-outline" size={20} color={colors.primary} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 45,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
  },
});
