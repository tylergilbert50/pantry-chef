import React from "react";
import { View, StyleSheet } from "react-native";
import colors from "../../theme/colors";

export function Account() {
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
});
