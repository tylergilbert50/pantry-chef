import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

import colors from "../../theme/colors";
import { PantrySearchBar } from "../pantry/components/SearchBar";
import RecipeCard from "./components/RecipeCard";
import { RecipesStackParamList } from "../../navigation/RecipesNavigator";
import { useUser } from "../../context/UserContext";
import { getIngredients } from "../../services/ingredientService";
import {
  searchRecipes,
  getRecipeInformationBulk,
  SpoonacularRecipe,
  SpoonacularRecipeInformation,
} from "../../services/apiService";
import {
  getRecipes,
  upsertRecipe,
  canMakeRecipe,
} from "../../services/recipeService";

type DiscoverRecipe = {
  id: string;
  title: string;
  mealType: string;
  image: string;
};

const SEARCH_IGNORE_INGREDIENTS = [
  "salt",
  "black pepper",
  "pepper",
  "olive oil",
  "butter",
  "water",
  "sugar",
];

function normalizeIngredientName(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .replace(/[®™©]/g, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatMealType(dishTypes: string[] | undefined) {
  if (!dishTypes || dishTypes.length === 0) {
    return "Recipe";
  }

  return dishTypes
    .map((type) =>
      type
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" "),
    )
    .slice(0, 2)
    .join(" / ");
}

export function Recipes() {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<DiscoverRecipe[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const navigation =
    useNavigation<NativeStackNavigationProp<RecipesStackParamList>>();

  const { profile, loading: userLoading } = useUser();
  const pantryId = profile?.pantry_id;
  const userId = profile?.user_id;

  const toggleSave = async (recipe: DiscoverRecipe) => {
    if (!userId) return;
    const wasSaved = savedIds.has(recipe.id);
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (wasSaved) next.delete(recipe.id);
      else next.add(recipe.id);
      return next;
    });
    const { data: existing } = await getRecipes(userId, {});
    const existingRow = existing?.find((r) => r.recipe_id === recipe.id);
    await upsertRecipe({
      recipe_id: recipe.id,
      user_id: userId,
      recipe_name: recipe.title,
      saved: !wasSaved,
      made_on: existingRow?.made_on ?? null,
    });
  };

  const loadRecipes = useCallback(async () => {
    if (!pantryId) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      const { data: pantryItems, error } = await getIngredients(pantryId);

      if (error) {
        console.error("Error fetching pantry ingredients:", error);
        setRecipes([]);
        return;
      }

      const pantryRows = pantryItems ?? [];

      const pantryIngredientNames = new Set<string>(
        pantryRows
          .map((item) =>
            normalizeIngredientName(item.name_normalized || item.name_product),
          )
          .filter((name) => name.length > 0)
          .filter((name) => !SEARCH_IGNORE_INGREDIENTS.includes(name)),
      );

      const pantryNamesForSearch = Array.from(pantryIngredientNames).sort();

      if (pantryNamesForSearch.length === 0) {
        setRecipes([]);
        return;
      }

      const foundRecipes: SpoonacularRecipe[] = await searchRecipes(
        pantryNamesForSearch.join(","),
        30,
        2, // Ranking 2 minimizes missing ingredients
        false,
      );

      if (!foundRecipes.length) {
        setRecipes([]);
        return;
      }

      const ids = foundRecipes.map((recipe) => recipe.id);
      const detailedRecipes: SpoonacularRecipeInformation[] =
        await getRecipeInformationBulk(ids, false);

      const matchedRecipes = detailedRecipes.filter(
        (recipe) => canMakeRecipe(recipe, pantryRows).canMake,
      );

      const uniqueRecipes = Array.from(
        new Map(
          matchedRecipes.map((recipe) => [
            recipe.id,
            {
              id: recipe.id.toString(),
              title: recipe.title,
              mealType: formatMealType(recipe.dishTypes),
              image: recipe.image,
            },
          ]),
        ).values(),
      );

      setRecipes(uniqueRecipes);

      if (userId) {
        const { data: savedRecipes } = await getRecipes(userId, {
          saved: true,
        });
        if (savedRecipes) {
          setSavedIds(new Set(savedRecipes.map((r) => r.recipe_id)));
        }
      }
    } catch (err) {
      console.error("Error loading recipes:", err);
      setRecipes([]);
    } finally {
      setLoading(false);
    }
  }, [pantryId, userId]);

  useFocusEffect(
    useCallback(() => {
      if (!userLoading) {
        loadRecipes();
      }
    }, [userLoading, loadRecipes]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadRecipes();
    setRefreshing(false);
  }, [loadRecipes]);

  const filtered = useMemo(() => {
    return recipes.filter((recipe) =>
      recipe.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [recipes, search]);

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.searchWrapper}>
        <PantrySearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search recipes"
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={2}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            filtered.length === 0 && styles.emptyList,
          ]}
          columnWrapperStyle={filtered.length > 0 ? styles.row : undefined}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
          ListHeaderComponent={
            <View style={styles.listHeader}>
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={styles.linkCard}
                  activeOpacity={0.8}
                  onPress={() => navigation.navigate("SavedRecipes")}
                >
                  <View style={styles.linkIcon}>
                    <Ionicons name="heart" size={20} color={colors.primary} />
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
              image={item.image}
              saved={savedIds.has(item.id)}
              onToggleSave={() => toggleSave(item)}
              onPress={() =>
                navigation.navigate("RecipeReader", {
                  recipeId: item.id,
                })
              }
            />
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="restaurant-outline" size={64} color="#ccc" />
              <Text style={styles.emptyTitle}>No recipes available</Text>
              <Text style={styles.emptySubtext}>
                Add more pantry ingredients to unlock recipes you can make right
                now.
              </Text>
            </View>
          }
        />
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 120,
  },
  listContent: {
    paddingTop: 140,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  listHeader: {
    marginBottom: 10,
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
  emptyList: {
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#999",
    marginTop: 16,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "#bbb",
    marginTop: 6,
    textAlign: "center",
  },
});
