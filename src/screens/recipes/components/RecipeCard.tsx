import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import colors from "../../../theme/colors";

type Props = {
  title: string;
  mealType: string;
  size?: "small";
  onPress?: () => void;
};

export default function RecipeCard({
  title,
  mealType,
  size = "small",
  onPress,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.imagePlaceholder} />

      <View style={styles.content}>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>

        <Text style={styles.mealType}>{mealType}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: colors.white,
    borderRadius: 22,
    overflow: "hidden",
    marginBottom: 20,
  },
  imagePlaceholder: {
    height: 130,
    width: "100%",
    backgroundColor: "#CFCFCF",
  },
  content: {
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
  mealType: {
    fontSize: 12,
    color: "#8F8F8F",
    marginTop: 4,
  },
});
