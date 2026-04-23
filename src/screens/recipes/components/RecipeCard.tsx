import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type Props = {
  title: string;
  mealType: string;
  saved?: boolean;
  size?: "small";
  onPress?: () => void;
  onToggleSave?: () => void;
};

export default function RecipeCard({
  title,
  mealType,
  saved = false,
  size = "small",
  onPress,
  onToggleSave,
}: Props) {
  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <TouchableOpacity style={styles.heartButton} onPress={onToggleSave}>
          <Ionicons
            name={saved ? "heart" : "heart-outline"}
            size={22}
            color={saved ? colors.secondary : colors.white}
          />
        </TouchableOpacity>
      </View>

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
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
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
