import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import { RecipesStackParamList } from "./RecipesNavigator";

export function RecipeCatalog() {
  const navigation =
    useNavigation<NativeStackNavigationProp<RecipesStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.titleWrapper}>
        <Text style={styles.title}>Recipes</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={styles.linkCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("SavedRecipes")}
        >
          <View style={styles.linkIcon}>
            <Ionicons name="bookmark" size={24} color={colors.primary} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>Saved Recipes</Text>
            <Text style={styles.linkSubtext}>Recipes you've bookmarked</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.linkCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("RecipeHistory")}
        >
          <View style={styles.linkIcon}>
            <Ionicons name="time" size={24} color={colors.primary} />
          </View>
          <View style={styles.linkInfo}>
            <Text style={styles.linkTitle}>Recipe History</Text>
            <Text style={styles.linkSubtext}>Recipes you've made</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    width: 900,
    height: 900,
    borderRadius: 325,
    top: -790,
    alignSelf: "center",
    backgroundColor: colors.primary,
    zIndex: 5,
  },
  titleWrapper: {
    paddingTop: 70,
    paddingBottom: 30,
    alignItems: "center",
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.white,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  linkCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    padding: 16,
    borderRadius: 20,
    marginBottom: 12,
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  linkIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  linkInfo: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  linkSubtext: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },
});
