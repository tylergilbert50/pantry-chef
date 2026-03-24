// SignInNavigator manages the sign in flow.
// It handles navigation between the different sign-in methods

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Landing } from "../screens/sign-in/Landing";
import { SignInWithEmail } from "../screens/sign-in/components/SignInWithEmail";

export type SignInStackParamList = {
  Landing: undefined;
  SignInWithEmail: undefined;
};

const Stack = createNativeStackNavigator<SignInStackParamList>();

export function SignInNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Landing"
        component={Landing}
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
    </Stack.Navigator>
  );
}
