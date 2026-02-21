// AppNavigator defines the main app navigation stack (Home, Pantry, Recipes, Account)
// It is rendered after the user has signed in

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { Barcode } from "../screens/barcode/Barcode";
import { Pantry } from "../screens/pantry/Pantry";
import { Recipes } from "../screens/recipes/Recipes";
import { Account } from "../screens/account/Account";

export type AppStackParamList = {
  Home: undefined;
  Pantry: undefined;
  Recipes: undefined;
  Account: undefined;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Barcode} />
      <Stack.Screen name="Pantry" component={Pantry} />
      <Stack.Screen name="Recipes" component={Recipes} />
      <Stack.Screen name="Account" component={Account} />
    </Stack.Navigator>
  );
}
