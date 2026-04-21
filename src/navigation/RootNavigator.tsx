import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { UserProvider, useUser } from "../context/UserContext";
import { SignInNavigator } from "./SignInNavigator";
import { AppNavigator } from "./AppNavigator";
import { Onboarding } from "../screens/onboarding/Onboarding";
import { supabase } from "../lib/supabase";
import colors from "../theme/colors";

function RootLayout() {
  const { session, loading } = useUser();

  const [showOnboarding, setShowOnboarding] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (loading) return;

      setReady(false);

      if (!session) {
        setShowOnboarding(false);
        setReady(true);
        return;
      }

      const { data, error } = await supabase
        .from("users")
        .select("first_name, last_name")
        .eq("user_id", session.user.id)
        .single();

      if (error) {
        console.error("Error fetching user:", error.message);
        setShowOnboarding(true);
        setReady(true);
        return;
      }

      const isComplete =
        !!data?.first_name?.trim() && !!data?.last_name?.trim();

      setShowOnboarding(!isComplete);
      setReady(true);
    };

    init();
  }, [session, loading]);

  function handleRestartOnboarding() {
    setShowOnboarding(true);
  }

  if (!ready) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: colors.primary,
        }}
      >
        <ActivityIndicator size="large" color={colors.white} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!session ? (
        <SignInNavigator />
      ) : showOnboarding ? (
        <Onboarding
          onFinish={() => {
            setShowOnboarding(false);
          }}
        />
      ) : (
        <AppNavigator onRestartOnboarding={handleRestartOnboarding} />
      )}
    </NavigationContainer>
  );
}

export function RootNavigator() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <RootLayout />
      </UserProvider>
    </GestureHandlerRootView>
  );
}
