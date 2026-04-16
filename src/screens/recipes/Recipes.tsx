import React, { useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView, ImageSourcePropType } from "react-native";
import Unorderedlist from 'react-native-unordered-list';
import { stripHtml } from "string-strip-html";
import { SpoonacularRecipeInstructions, SpoonacularRecipeInformation, getRecipeInformation, SpoonacularIngredientList, SpoonacularIngredient, getRecipeInstructions, SpoonacularRecipeStep } from "../../services/apiService";


type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
  textIntro: string;
  ingredients: SpoonacularIngredientList;
  bodyText: string;
  heroImageUri: string;
  instructions?: SpoonacularRecipeInstructions;
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

const IngredientList = ({ ingredients }: {ingredients: SpoonacularIngredientList}) => {
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

const NumberedList = ({ items }: { items: string[] }) => {
  return (
    <View>
      {items.map((item, index) => (
        <Text key={index}>
          {index + 1}. {item}
        </Text>
      ))}
    </View>
  )
};

export function Recipes() {
  const [data, setData] = useState(createInitialProps);
  useEffect(() => {
    const fetchRecipe = async () => {
      const testId: number = 324694;
      const recipe: SpoonacularRecipeInformation = await getRecipeInformation(testId, false);
      if (recipe != null) {
        setData({
          title: recipe.title,
          recipeType: recipe.dishTypes.join(" / "),
          detailCards: {"Total time": recipe.readyInMinutes.toString() + " min.", "Servings": recipe.servings.toString()},
          textIntro: stripHtml(recipe.summary.split(".")[0]).result + ".", // TODO: Fix this to work on strings without .
          ingredients: recipe.extendedIngredients,
          bodyText: "",
          heroImageUri: recipe.image,
        });
      }
      /*const instructions: SpoonacularRecipeInstructions = await getRecipeInstructions(testId);
      if (instructions != null) {
        setData({
          ...data,
          instructions: instructions
        });
        console.log("Got instruction data");
        console.log(instructions);
      }*/
    }
    fetchRecipe();
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.statusBarBackground}></View>
      <Image
        style={styles.heroImage}
        source={{uri: data.heroImageUri}}
        />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <View style={styles.cardShadow}></View>
          <Text style={styles.title}>
            {data.title}
          </Text>
          <Text style={styles.recipeType}>
            {data.recipeType}
          </Text>
          <Text style={styles.bodyText}>
            {data.textIntro}
          </Text>
          <View style={styles.horizontalFlex}>
            {Object.entries(data.detailCards).map(([name, value]) => (
              <View style={styles.detailCard} key={name}>
                <Text style={styles.infoText}>{name}</Text>
                <Text style={styles.bold}>{value}</Text>
              </View>

            ))}
          </View>
          <Text style={styles.header}>
            Ingredients
          </Text>
          <IngredientList ingredients={ data.ingredients }></IngredientList>
          <Text style={styles.header}>
            Directions
          </Text>
          <Text style={styles.bodyText}>
            {data.bodyText}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
// <NumberedList items={ data.instructions?.steps?.map(step => step.step).filter(Boolean) ?? []}></NumberedList>

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  card: {
    marginTop: 250,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  cardShadow: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    minHeight: 100,
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: "0px 0px 20px #101010",
    zIndex: -1
  },
  detailCard: {
    backgroundColor: "#F5F5F5",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 10
  },
  heroImage: {
    height: 300,
    width: "100%",
    position: "absolute",
    top: 50,
  },
  scrollView: {
    position: "relative",
  },
  title: {
    fontSize: 30,
  },
  recipeType: {
    marginBottom: 15,
    fontSize: 20,
    color: "#00000080"
  },
  bodyText: {
    fontSize: 24,
  },
  ingredientText: {
    fontSize: 20,
  },
  bulletText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  bold: {
    fontWeight: "bold"
  },
  infoText: {
    color: "#00000080"
  },
  header: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  recipeImage: {
    position: "relative",
    width: "100%",
    maxHeight: 600
  },
  horizontalFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusBarBackground: {
    position: "relative",
    height: 50,
    backgroundColor: "orange",
    zIndex: 5
  }
});
