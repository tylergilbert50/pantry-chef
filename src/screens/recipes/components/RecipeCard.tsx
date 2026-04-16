import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../../theme/colors";

type RecipeCardProps = {
  name: string;
  saved: boolean;
  madeOn?: string | null;
  onToggleSave: () => void;
  onPress: () => void;
};

export default function RecipeCard({
  name,
  saved,
  madeOn,
  onToggleSave,
  onPress,
}: RecipeCardProps) {
  const formattedDate = madeOn
    ? new Date(madeOn).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <Ionicons name="restaurant-outline" size={28} color={colors.primary} />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        {formattedDate && (
          <Text style={styles.subText}>Made on {formattedDate}</Text>
        )}
      </View>

      <TouchableOpacity
        onPress={onToggleSave}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={saved ? "bookmark" : "bookmark-outline"}
          size={24}
          color={saved ? colors.primary : "#aaa"}
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 14,
    borderRadius: 20,
    marginVertical: 8,
    width: "90%",
    alignSelf: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  subText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
