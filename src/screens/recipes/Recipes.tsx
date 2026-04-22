import React, { useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../theme/colors";
import { PantrySearchBar } from "../pantry/components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import { RecipesStackParamList } from "../../navigation/RecipesNavigator";

type DiscoverRecipe = {
  id: string;
  title: string;
  mealType: string;
};

const RECIPES: DiscoverRecipe[] = [
  { id: "324694", title: "Chicken Fried Rice", mealType: "Dinner / Lunch" },
  { id: "715538", title: "Ground Beef Tacos", mealType: "Dinner / Lunch" },
  { id: "716429", title: "Spinach Pasta", mealType: "Dinner / Lunch" },
  { id: "644387", title: "Garlic Butter Shrimp", mealType: "Dinner" },
  { id: "632660", title: "Apple Cinnamon Oatmeal", mealType: "Breakfast" },
  { id: "663559", title: "Tomato Basil Soup", mealType: "Lunch / Dinner" },
];

export function Recipes() {
  const [search, setSearch] = useState("");

  const navigation =
    useNavigation<NativeStackNavigationProp<RecipesStackParamList>>();

  const filtered = useMemo(() => {
    return RECIPES.filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [search]);

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.searchWrapper}>
        <PantrySearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search for recipes"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.row}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={styles.linkCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("SavedRecipes")}
              >
                <View style={styles.linkIcon}>
                  <Ionicons name="bookmark" size={20} color={colors.primary} />
                </View>
                <Text style={styles.linkTitle}>Saved</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.linkCard}
                activeOpacity={0.8}
                onPress={() => navigation.navigate("RecipeHistory")}
              >
                <View style={styles.linkIcon}>
                  <Ionicons name="time" size={20} color={colors.primary} />
                </View>
                <Text style={styles.linkTitle}>History</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <RecipeCard
            title={item.title}
            mealType={item.mealType}
            onPress={() =>
              navigation.navigate("RecipeReader", {
                recipeId: item.id,
              })
            }
          />
        )}
      />
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
    zIndex: 1,
  },
  searchWrapper: {
    position: "absolute",
    top: 80,
    width: "85%",
    alignSelf: "center",
    zIndex: 10,
  },
  listContent: {
    paddingTop: 140,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
    marginBottom: 16,
    paddingHorizontal: 2,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  linkCard: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: 7,
    paddingHorizontal: 7,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: colors.black,
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  linkIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#FFF3E0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  linkTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.black,
  },
  row: {
    justifyContent: "space-between",
  },
});
