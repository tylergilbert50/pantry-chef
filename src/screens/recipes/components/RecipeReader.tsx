import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import Unorderedlist from "react-native-unordered-list";
import { stripHtml } from "string-strip-html";

import { RecipesStackParamList } from "../../../navigation/RecipesNavigator";
import {
  getRecipeInformation,
  getRecipeInstructions,
  SpoonacularRecipeInformation,
  SpoonacularRecipeInstructions,
  SpoonacularExtendedIngredientList,
} from "../../../services/apiService";
import { madeRecipe } from "../../../services/recipeService";
import { useUser } from "../../../context/UserContext";
import colors from "../../../theme/colors";

type RecipeReaderRouteProp = RouteProp<RecipesStackParamList, "RecipeReader">;

type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
  textIntro: string;
  ingredients: SpoonacularExtendedIngredientList;
  heroImageUri: string;
  instructions: string[];
};

function createInitialProps(): RecipeProps {
  return {
    title: "",
    recipeType: "",
    detailCards: {},
    textIntro: "",
    ingredients: [],
    heroImageUri: "",
    instructions: [],
  };
}

function IngredientList({
  ingredients,
}: {
  ingredients: SpoonacularExtendedIngredientList;
}) {
  return (
    <View>
      {ingredients.map((ingredient) => (
        <View
          key={`${ingredient.id}-${ingredient.name}-${ingredient.original}`}
          style={styles.listItem}
        >
          <Unorderedlist bulletUnicode={0x2022}>
            <Text style={styles.ingredientText}>{ingredient.original}</Text>
          </Unorderedlist>
        </View>
      ))}
    </View>
  );
}

function NumberedList({ items }: { items: string[] }) {
  return (
    <View>
      {items.map((item, index) => (
        <Text key={`${index}-${item}`} style={styles.directionText}>
          {index + 1}. {item}
        </Text>
      ))}
    </View>
  );
}

export default function RecipeReader() {
  const route = useRoute<RecipeReaderRouteProp>();
  const { recipeId } = route.params;
  const { profile } = useUser();
  const pantryId = profile?.pantry_id;

  const [data, setData] = useState<RecipeProps>(createInitialProps());
  const [loading, setLoading] = useState(true);
  const [makingRecipe, setMakingRecipe] = useState(false);

  const handleMadeRecipe = async () => {
    if (!pantryId) {
      Alert.alert("Error", "No pantry found for your account.");
      return;
    }
    setMakingRecipe(true);
    try {
      await madeRecipe(recipeId, pantryId);
      Alert.alert("Nice!", "Recipe marked as made and pantry updated.");
    } catch (error) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setMakingRecipe(false);
    }
  };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const numericRecipeId = Number(recipeId);

        const recipe: SpoonacularRecipeInformation = await getRecipeInformation(
          numericRecipeId,
          false,
        );

        const instructionsResponse: SpoonacularRecipeInstructions =
          await getRecipeInstructions(numericRecipeId);

        let textIntro = "";
        if (recipe.summary) {
          if (recipe.summary.includes(".")) {
            textIntro = stripHtml(recipe.summary.split(".")[0]).result + ".";
          } else {
            textIntro = stripHtml(recipe.summary).result;
          }
        }

        const instructionSteps = Array.isArray(
          (instructionsResponse as any)?.[0]?.steps,
        )
          ? (instructionsResponse as any)[0].steps
              .map((step: any) => step.step)
              .filter(Boolean)
          : [];

        setData({
          title: recipe.title,
          recipeType:
            recipe.dishTypes?.length > 0
              ? recipe.dishTypes.join(" / ")
              : "Recipe",
          detailCards: {
            "Total time": `${recipe.readyInMinutes} min`,
            Servings: recipe.servings.toString(),
          },
          textIntro,
          ingredients: recipe.extendedIngredients ?? [],
          heroImageUri: recipe.image,
          instructions: instructionSteps,
        });
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!!data.heroImageUri && (
        <Image source={{ uri: data.heroImageUri }} style={styles.heroImage} />
      )}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.card}>
          <Text style={styles.title}>{data.title}</Text>
          <Text style={styles.recipeType}>{data.recipeType}</Text>

          {!!data.textIntro && (
            <Text style={styles.bodyText}>{data.textIntro}</Text>
          )}

          <View style={styles.horizontalFlex}>
            {Object.entries(data.detailCards).map(([name, value]) => (
              <View style={styles.detailCard} key={name}>
                <Text style={styles.infoText}>{name}</Text>
                <Text style={styles.bold}>{value}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.header}>Ingredients</Text>
          <IngredientList ingredients={data.ingredients} />

          <Text style={styles.header}>Directions</Text>
          <NumberedList items={data.instructions} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.madeButton, makingRecipe && styles.madeButtonDisabled]}
          onPress={handleMadeRecipe}
          disabled={makingRecipe}
        >
          {makingRecipe ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.madeButtonText}>I Made This!</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroImage: {
    width: "100%",
    height: 260,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  card: {
    marginTop: -24,
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    minHeight: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.black,
  },
  recipeType: {
    marginTop: 6,
    marginBottom: 16,
    fontSize: 16,
    color: "#777",
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
  },
  header: {
    fontWeight: "700",
    fontSize: 22,
    marginTop: 24,
    marginBottom: 12,
    color: colors.black,
  },
  horizontalFlex: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
    gap: 10,
  },
  detailCard: {
    backgroundColor: "#F5F5F5",
    minWidth: 110,
    paddingVertical: 14,
    paddingHorizontal: 12,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 18,
  },
  infoText: {
    color: "#777",
    fontSize: 12,
    marginBottom: 4,
  },
  bold: {
    fontWeight: "700",
    color: colors.black,
  },
  ingredientText: {
    fontSize: 16,
    color: colors.black,
  },
  directionText: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.black,
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 8,
  },
  statusBarBackground: {
    height: 50,
    backgroundColor: "orange",
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    paddingBottom: 32,
    backgroundColor: "#fff",
  },
  madeButton: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  madeButtonDisabled: {
    opacity: 0.5,
  },
  madeButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },
});
