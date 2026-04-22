import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Recipes } from "../screens/recipes/Recipes";
import { RecipesList } from "../screens/recipes/RecipesList";
import RecipeReader from "../screens/recipes/components/RecipeReader";

export type RecipesStackParamList = {
  RecipesHome: undefined;
  SavedRecipes: undefined;
  RecipeHistory: undefined;
  RecipeReader: { recipeId: string };
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipesHome" component={Recipes} />
      <Stack.Screen name="SavedRecipes">
        {() => <RecipesList mode="saved" />}
      </Stack.Screen>
      <Stack.Screen name="RecipeHistory">
        {() => <RecipesList mode="history" />}
      </Stack.Screen>
      <Stack.Screen name="RecipeReader" component={RecipeReader} />
    </Stack.Navigator>
  );
}
