import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type Props = {
  title?: string;
  name?: string;
  mealType?: string;
  image?: string;
  saved?: boolean;
  madeOn?: string | null;
  size?: "small";
  onPress?: () => void;
  onToggleSave?: () => void;
};

export default function RecipeCard({
  title,
  name,
  mealType,
  saved = false,
  image,
  madeOn,
  size = "small",
  onPress,
  onToggleSave,
}: Props) {
  const displayTitle = title ?? name ?? "";

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onPress} style={styles.card}>
      {image ? (
        <Image
          source={{ uri: image }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={styles.imagePlaceholder} />
      )}
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
          {displayTitle}
        </Text>

        {!!mealType && <Text style={styles.mealType}>{mealType}</Text>}

        {!!madeOn && (
          <Text style={styles.metaText}>
            {new Date(madeOn).toLocaleDateString()}
          </Text>
        )}

        {typeof saved === "boolean" && onToggleSave && (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={onToggleSave}
            style={styles.saveButton}
          >
            <Ionicons
              name={saved ? "bookmark" : "bookmark-outline"}
              size={18}
              color={colors.primary}
            />
          </TouchableOpacity>
        )}
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
    position: "relative",
  },
  image: {
    height: 130,
    width: "100%",
    backgroundColor: "#CFCFCF",
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
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    minHeight: 76,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: colors.black,
  },
  mealType: {
    fontSize: 12,
    color: "#8F8F8F",
    marginTop: 4,
    textAlign: "center",
  },
  metaText: {
    fontSize: 12,
    color: "#8F8F8F",
    marginTop: 4,
    textAlign: "center",
  },
  saveButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: colors.white,
    borderRadius: 999,
    padding: 6,
  },
});
