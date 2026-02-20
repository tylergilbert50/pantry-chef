import React from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import colors from "../../theme/colors";
import Auth from "../../components/auth";

export const SignIn: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>PantryChef</Text>
      <ImageBackground
        source={require("../../../assets/images/signin/background-image.png")}
        style={styles.backgroundImage}
        resizeMode="contain"
      >
        <Image
          source={require("../../../assets/images/signin/food-image.png")}
          style={styles.foodImage}
          resizeMode="contain"
        />
      </ImageBackground>

      <Auth />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.primary,
  },
  title: {
    color: "white",
    textAlign: "center",
    fontFamily: "InriaSerif_700Bold",
    fontSize: 48,
  },
  backgroundImage: {
    width: 450,
    height: 450,
    justifyContent: "center",
    alignItems: "center",
  },
  foodImage: {
    width: "75%",
    height: "60%",
    marginTop: "20%",
  },
});
