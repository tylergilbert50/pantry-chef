import React from "react";
import { View, Text, Image, StyleSheet, ScrollView } from "react-native";
import BulletList from "../../components/bulletlist";

type RecipeProps = {
  title: string;
  recipeType: string;
  detailCards: Record<string, string>;
  textIntro: string;
  ingredients: Record<string, Array<String>>;
  bodyText: string;
};

export function Recipes({title, recipeType, detailCards, textIntro, ingredients, bodyText}: RecipeProps) {
  return (
    <View style={styles.container}>
      <View style={styles.statusBarBackground}></View>
      <Image
        style={styles.heroImage}
        source={
            require("../../../assets/images/placeholders/rice.png")
          }
        />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.card}>
          <View style={styles.cardShadow}></View>
          <Text style={styles.title}>
            {title}
          </Text>
          <Text style={styles.recipeType}>
            {recipeType}
          </Text>
          <Text style={styles.bodyText}>
            {textIntro}
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
          <BulletList items={ingredients.items}></BulletList>
          <Text style={styles.header}>
            Directions
          </Text>
          <Text style={styles.bodyText}>
            {bodyText}
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
    marginTop: 250,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
  },
  cardShadow: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    minHeight: 100,
    backgroundColor: "white",
    borderRadius: 20,
    boxShadow: "0px 0px 20px #101010",
    zIndex: -1
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
    marginBottom: 15,
    fontSize: 20,
    color: "#00000080"
  },
  bodyText: {
    fontSize: 24
  },
  bold: {
    fontWeight: "bold"
  },
  infoText: {
    color: "#00000080"
  },
  header: {
    fontWeight: "bold",
    fontSize: 25,
    marginTop: 10,
    marginBottom: 10,
  },
  recipeImage: {
    position: "relative",
    width: "100%",
    maxHeight: 600
  },
  horizontalFlex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  statusBarBackground: {
    position: "relative",
    height: 50,
    backgroundColor: "white",
    zIndex: 5
  }
});
