// RootNavigator decides whether to render the in app stack
// or the sign-in stack based on the user's session state

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { UserProvider, useUser } from "../context/UserContext";
import { SignInNavigator } from "./SignInNavigator";
import { AppNavigator } from "./AppNavigator";

function RootLayout() {
  const { session, loading } = useUser();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <SignInNavigator />}
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return (
    <UserProvider>
      <RootLayout />
    </UserProvider>
  );
}
