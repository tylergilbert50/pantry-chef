import React, { useState } from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";

type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
};

export function Recipes({title, recipeType, detailCards}: RecipeProps) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.heroImage}
        source={
            require("../../../assets/images/placeholders/rice.png")
          }
        />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.recipeType}>
            {recipeType}
          </Text>
          <Text style={styles.bodyText}>
            Hello there!
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
          <View style={styles.horizontalFlex}>
            {Object.entries(detailCards).map(([name, value]) => (
              <View style={styles.detailCard}>
                <Text style={styles.infoText}>{name}</Text>
                <Text style={styles.bold}>{value}</Text>
              </View>

            ))}
          </View>
          <Text style={styles.header}>
            Ingredients
          </Text>
          <Image
            style={styles.recipeImage}
            source={
                require("../../../assets/images/placeholders/rice.png")
              }
          />
          <Text style={styles.bodyText}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF"
  },
  card: {
    backgroundColor: "white",
    marginTop: 300,
    borderRadius: 20,
    padding: 20,
    boxShadow: "0px 0px 10px #101010"
  },
  detailCard: {
    backgroundColor: "#F5F5F5",
    width: 70,
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    margin: 10
  },
  heroImage: {
    height: 300,
    width: "100%",
    position: "absolute",
    top: 50
  },
  scrollView: {
    position: "relative",
  },
  title: {
    fontSize: 30,
  },
  recipeType: {
    fontSize: 20,
    color: "#00000080"
  },
  bodyText: {
    fontSize: 20,
    marginTop: 20
  },
  bold: {
    fontWeight: "bold"
  },
  infoText: {
    color: "#00000080"

  },
  header: {
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10
  },
  recipeImage: {
    position: "relative",
    width: "100%",
    maxHeight: 600
  },
  horizontalFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  }
});
