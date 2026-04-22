import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Unorderedlist from "react-native-unordered-list";
import { stripHtml } from "string-strip-html";

import {
  SpoonacularRecipeInformation,
  SpoonacularIngredientList,
  getRecipeInformation,
} from "../../../services/apiService";

type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
  textIntro: string;
  ingredients: SpoonacularIngredientList;
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
  ingredients: SpoonacularIngredientList;
}) => {
  return (
    <View>
      {ingredients.map((ingredient) => (
        <View key={ingredient.id}>
          <Unorderedlist style={styles.bulletText}>
            <Text style={styles.ingredientText}>{ingredient.original}</Text>
          </Unorderedlist>
        </View>
      ))}
    </View>
  );
};

export default function RecipeReader() {
  const [data, setData] = useState(createInitialProps);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);

        const testId: number = 324694;

        const recipe: SpoonacularRecipeInformation = await getRecipeInformation(
          testId,
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
});
