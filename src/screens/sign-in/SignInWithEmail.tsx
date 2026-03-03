import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../../theme/colors";
import Auth from "../../components/auth";

export const SignInWithEmail: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PantryChef</Text>

      <Image
        source={require("../../../assets/icons/pantrychef-icon.png")}
        style={styles.icon}
        resizeMode="contain"
      />
      <Auth />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    color: colors.primary,
    textAlign: "center",
    fontFamily: "InriaSerif_700Bold",
    fontSize: 48,
  },
  icon: {
    marginLeft: 10,
    marginTop: 10,
    width: 160,
    height: 160,
  },
});
