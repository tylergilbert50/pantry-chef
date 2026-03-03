// SignInNavigator manages the sign in flow.
// It handles navigation between the different sign-in methods

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SignIn } from "../screens/sign-in/SignIn";
import { SignInWithEmail } from "../screens/sign-in/SignInWithEmail";
import { ForgotPassword } from "../screens/sign-in/ForgotPassword";
import { Register } from "../screens/sign-in/Register";

export type SignInStackParamList = {
  SignIn: undefined;
  SignInWithEmail: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

const Stack = createNativeStackNavigator<SignInStackParamList>();

export function SignInNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SignIn"
        component={SignIn}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignInWithEmail"
        component={SignInWithEmail}
        options={{
          presentation: "modal",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Register"
        component={Register}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
