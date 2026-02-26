import React from "react";
import { Image, Text, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

const ScreenWrapper = ({ label }: { label: string }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{label}</Text>
  </View>
);

function PantryScreen() {
  return <ScreenWrapper label="Pantry Screen" />;
}

function RecipeScreen() {
  return <ScreenWrapper label="Recipe Screen" />;
}

function ScannerScreen() {
  return <ScreenWrapper label="Scanner Screen" />;
}

function ProfileScreen() {
  return <ScreenWrapper label="Profile Screen" />;
}

export  function Navbar() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 100,
            backgroundColor: "#FF9E00",
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#ffffff",
        }}
      >
        <Tab.Screen name=" " component={PantryScreen} options={{
          tabBarIcon: ({focused}) => (
              <View style={{ alignItems: "center", justifyContent: "center" , top: 10 }}>
                <Image
                  source={require("../../assets/icons/navbar/pantry-icon.png")}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    alignContent: "center"
                  }}
                />
              </View>
          ),
        }} />
        <Tab.Screen name="  " component={RecipeScreen} options={{
           tabBarIcon: ({focused}) => (
              <View style={{ alignItems: "center", justifyContent: "center" , top: 10 }}>
                <Image
                  source={require("../../assets/icons/navbar/recipe-icon.png")}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    alignContent: "center"
                  }}
                />
              </View>
          ),
        }}/>
        <Tab.Screen name="   " component={ScannerScreen} options = {{
           tabBarIcon: ({focused}) => (
              <View style={{ alignItems: "center", justifyContent: "center" , top: 10 }}>
                <Image
                  source={require("../../assets/icons/navbar/barcode.icon.png")}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    alignContent: "center"
                  }}
                />
              </View>
          ),
        }}/>
        <Tab.Screen name="     " component={ProfileScreen} options = {{
          tabBarIcon: ({focused}) => (
              <View style={{ alignItems: "center", justifyContent: "center" , top: 10 }}>
                <Image
                  source={require("../../assets/icons/navbar/profile-icon.png")}
                  resizeMode="contain"
                  style={{
                    width: 40,
                    height: 40,
                    alignContent: "center"
                  }}
                />
              </View>
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}