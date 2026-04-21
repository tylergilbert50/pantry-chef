import React from "react";
import { Image, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { Barcode } from "../screens/barcode/Barcode";
import { Pantry } from "../screens/pantry/Pantry";
import { RecipesNavigator } from "../screens/recipes/RecipesNavigator";
import { Account } from "../screens/account/Account";
import colors from "../theme/colors";

export type AppTabParamList = {
  Pantry: undefined;
  Recipes: undefined;
  Home: undefined;
  Account: undefined;
};

const Tab = createBottomTabNavigator<AppTabParamList>();

type TabIconProps = {
  source: any;
  focused: boolean;
};

type AppNavigatorProps = {
  onRestartOnboarding: () => void;
};

function TabIcon({ source, focused }: TabIconProps) {
  return (
    <View style={styles.iconWrapper}>
      <Image source={source} resizeMode="contain" style={styles.icon} />
      {focused && <View style={styles.indicator} />}
    </View>
  );
}

export function AppNavigator({ onRestartOnboarding }: AppNavigatorProps) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
      }}
    >
      <Tab.Screen
        name="Pantry"
        component={Pantry}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("@assets/icons/navbar/pantry-icon.png")}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Recipes"
        component={RecipesNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/icons/navbar/recipe-icon.png")}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Home"
        component={Barcode}
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/icons/navbar/barcode.icon.png")}
              focused={focused}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Account"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              source={require("../../assets/icons/navbar/profile-icon.png")}
              focused={focused}
            />
          ),
        }}
      >
        {() => <Account onRestartOnboarding={onRestartOnboarding} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    backgroundColor: colors.primary,
  },
  iconWrapper: {
    width: 60,
    height: 60,
    marginTop: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  icon: {
    width: 30,
    height: 30,
  },
  indicator: {
    position: "absolute",
    bottom: 0,
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
});
