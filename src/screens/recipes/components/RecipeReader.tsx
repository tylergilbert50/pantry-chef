import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import Unorderedlist from "react-native-unordered-list";
import { stripHtml } from "string-strip-html";

import {
  SpoonacularRecipeInformation,
  SpoonacularExtendedIngredientList,
  getRecipeInformation,
} from "../../../services/apiService";
import { madeRecipe } from "../../../services/recipeService";
import { useUser } from "../../../context/UserContext";
import colors from "../../../theme/colors";

type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
  textIntro: string;
  ingredients: SpoonacularExtendedIngredientList;
  bodyText: string;
  heroImageUri: string;
};

function createInitialProps(): RecipeProps {
  return {
    title: "",
    recipeType: "",
    detailCards: {},
    textIntro: "",
    ingredients: [],
    bodyText: "",
    heroImageUri: "",
  };
}

const IngredientList = ({
  ingredients,
}: {
  ingredients: SpoonacularExtendedIngredientList;
}) => {
  return (
    <View>
      {ingredients.map((ingredient, index) => (
          <View key={`${ingredient.id}-${index}`}>
          <Unorderedlist style={styles.bulletText}>
            <Text style={styles.ingredientText}>{ingredient.original}</Text>
          </Unorderedlist>
        </View>
      ))}
    </View>
  );
};

export default function RecipeReader({ route }: any) {
  const recipeId = route?.params?.recipeId ?? "324694";
  const { profile } = useUser();
  const pantryId = profile?.pantry_id;

  const [data, setData] = useState(createInitialProps);
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

        const recipe: SpoonacularRecipeInformation = await getRecipeInformation(
          Number(recipeId),
          false,
        );

        if (recipe) {
          const firstSentence =
            stripHtml(recipe.summary?.split(".")[0] ?? "").result || "";

          setData({
            title: recipe.title,
            recipeType: recipe.dishTypes.join(" / "),
            detailCards: {
              "Total time": `${recipe.readyInMinutes} min.`,
              Servings: recipe.servings.toString(),
            },
            textIntro: firstSentence ? `${firstSentence}.` : "",
            ingredients: recipe.extendedIngredients,
            bodyText: "",
            heroImageUri: recipe.image,
          });
        }
      } catch (error) {
        console.error("Error loading recipe:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.statusBarBackground} />

      {!!data.heroImageUri && (
        <Image style={styles.heroImage} source={{ uri: data.heroImageUri }} />
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
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
          <Text style={styles.bodyText}>
            Recipe directions can be added here once you wire in the
            instructions endpoint.
          </Text>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    paddingBottom: 100,
  },
  card: {
    marginTop: 250,
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: 500,
  },
  detailCard: {
    backgroundColor: "#F5F5F5",
    width: 84,
    height: 84,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 8,
  },
  heroImage: {
    height: 300,
    width: "100%",
    position: "absolute",
    top: 50,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#111",
  },
  recipeType: {
    marginBottom: 15,
    fontSize: 18,
    color: "#00000080",
  },
  bodyText: {
    fontSize: 18,
    lineHeight: 28,
    color: "#222",
  },
  ingredientText: {
    fontSize: 18,
    color: "#222",
  },
  bulletText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "700",
    textAlign: "center",
  },
  infoText: {
    color: "#00000080",
    textAlign: "center",
    marginBottom: 4,
    fontSize: 12,
  },
  header: {
    fontWeight: "700",
    fontSize: 24,
    marginTop: 20,
    marginBottom: 12,
    color: "#111",
  },
  horizontalFlex: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 18,
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
