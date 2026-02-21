// SignInNavigator manages the sign in flow.
// It handles navigation between the different sign-in methods

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "../screens/sign-in/SignIn";
import { SignInWithEmail } from "../screens/sign-in/SignInWithEmail";

export type SignInStackParamList = {
  SignIn: undefined;
  SignInWithEmail: undefined;
};

const Stack = createNativeStackNavigator<SignInStackParamList>();

export function SignInNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignInWithEmail" component={SignInWithEmail} />
    </Stack.Navigator>
  );
}
