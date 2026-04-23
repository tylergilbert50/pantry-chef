import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";
import colors from "../../theme/colors";
import RecipeCard from "./components/RecipeCard";
import { getRecipes, upsertRecipe } from "../../services/recipeService";
import { useUser } from "../../context/UserContext";
import { Database } from "../../../types/database.types";
import { RecipesStackParamList } from "../../navigation/RecipesNavigator";

type Recipe = Database["public"]["Tables"]["recipes"]["Row"];

type RecipesListProps = {
  mode: "saved" | "history";
};

export function RecipesList({ mode }: RecipesListProps) {
  const { profile } = useUser();
  const userId = profile?.user_id;
  const navigation =
    useNavigation<NativeStackNavigationProp<RecipesStackParamList>>();

  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecipes = useCallback(async () => {
    if (!userId) return;

    const filters =
      mode === "saved" ? { saved: true } : { made: true as const };

    const { data, error } = await getRecipes(userId, filters);

    if (error) {
      console.error("Error fetching recipes:", error);
      return;
    }

    setRecipes(data ?? []);
  }, [userId, mode]);

  useFocusEffect(
    useCallback(() => {
      fetchRecipes();
    }, [fetchRecipes]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchRecipes();
    setRefreshing(false);
  }, [fetchRecipes]);

  const toggleSave = async (recipe: Recipe) => {
    if (!userId) return;

    const updated = { ...recipe, saved: !recipe.saved };

    setRecipes((prev) =>
      mode === "saved" && !updated.saved
        ? prev.filter((r) => r.recipe_id !== recipe.recipe_id)
        : prev.map((r) => (r.recipe_id === recipe.recipe_id ? updated : r)),
    );

    await upsertRecipe({
      ...recipe,
      saved: !recipe.saved,
    });
  };

  const filtered = recipes
    .filter((r) => r.recipe_name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (mode === "history") {
        return (
          new Date(b.made_on ?? 0).getTime() -
          new Date(a.made_on ?? 0).getTime()
        );
      }

      return a.recipe_name.localeCompare(b.recipe_name, undefined, {
        sensitivity: "base",
      });
    });

  const isSaved = mode === "saved";

  return (
    <View style={styles.container}>
      <View style={styles.header} />

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder={
              isSaved ? "Search saved recipes..." : "Search recipe history..."
            }
            placeholderTextColor="#999"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.recipe_id}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.listContent,
          filtered.length === 0 && styles.emptyList,
        ]}
        columnWrapperStyle={filtered.length > 0 ? styles.row : undefined}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        renderItem={({ item }) => (
          <RecipeCard
            name={item.recipe_name}
            saved={item.saved ?? false}
            madeOn={item.made_on}
            onToggleSave={() => toggleSave(item)}
            onPress={() =>
              navigation.navigate("RecipeReader", {
                recipeId: item.recipe_id,
              })
            }
          />
        )}
        ListEmptyComponent={
          !refreshing ? (
            <View style={styles.emptyContainer}>
              <Ionicons
                name={isSaved ? "bookmark-outline" : "time-outline"}
                size={64}
                color="#ccc"
              />
              <Text style={styles.emptyTitle}>
                {isSaved ? "No saved recipes" : "No recipe history"}
              </Text>
              <Text style={styles.emptySubtext}>
                {isSaved
                  ? "Recipes you bookmark will appear here"
                  : "Recipes you've made will appear here"}
              </Text>
            </View>
          ) : null
        }
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
    zIndex: 5,
  },
  searchWrapper: {
    position: "absolute",
    top: 80,
    width: "85%",
    alignSelf: "center",
    zIndex: 10,
  },
  searchBar: {
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
  searchInput: {
    flex: 1,
    marginHorizontal: 8,
    fontSize: 16,
  },
  listContent: {
    paddingTop: 140,
    paddingHorizontal: 16,
    paddingBottom: 40,
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
    paddingTop: 60,
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
    paddingHorizontal: 40,
  },
});
