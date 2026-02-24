// RootNavigator decides whether to render the in app stack
// or the sign-in stack based on the user's session state

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Session } from "@supabase/supabase-js";
import { SignInNavigator } from "./SignInNavigator";
import { AppNavigator } from "./AppNavigator";

type Props = {
  session: Session | null;
};

export function RootNavigator({ session }: Props) {
  return (
    <NavigationContainer>
      {session ? <AppNavigator /> : <SignInNavigator />}
    </NavigationContainer>
  );
}
