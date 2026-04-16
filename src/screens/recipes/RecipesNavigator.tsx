import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RecipeCatalog } from "./RecipeCatalog";
import { RecipesList } from "./RecipesList";
import { RecipeDetail } from "./RecipeDetail";

export type RecipesStackParamList = {
  RecipeCatalog: undefined;
  SavedRecipes: undefined;
  RecipeHistory: undefined;
  RecipeDetail: undefined;
};

const Stack = createNativeStackNavigator<RecipesStackParamList>();

export function RecipesNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecipeCatalog" component={RecipeCatalog} />
      <Stack.Screen name="SavedRecipes">
        {() => <RecipesList mode="saved" />}
      </Stack.Screen>
      <Stack.Screen name="RecipeHistory">
        {() => <RecipesList mode="history" />}
      </Stack.Screen>
      <Stack.Screen name="RecipeDetail" component={RecipeDetail} />
    </Stack.Navigator>
  );
}
