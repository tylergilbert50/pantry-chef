import React, { useState } from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export function Recipes() {
  const heroImage = useState("../../assets/images/placeholders/rice.png");
  return (
    <View style={styles.container}>
      <Image
        style={styles.heroImage}
        source={
            require("../../../assets/images/placeholders/rice.png")
          }
        />
      <Text>
        Hello there.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  heroImage: {
    height: 200
  }
});
