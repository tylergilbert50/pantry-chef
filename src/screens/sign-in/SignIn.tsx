import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import colors from "../../theme/colors";

export const SignIn: React.FC = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.title}>PantryChef</Text>
        <Text style={styles.subTitle}>
          Cook what you own. Save what you earn.
        </Text>
      </View>

      <View style={styles.imageWrapper}>
        <Image
          source={require("../../../assets/images/sign-in/background-image.png")}
          style={styles.backgroundImage}
          resizeMode="contain"
        />
      </View>

      <View style={styles.bottomWrapper}>
        <TouchableOpacity
          style={styles.signInWithEmailButton}
          onPress={() => null}
        >
          <Image
            source={require("../../../assets/icons/email-icon.png")}
            style={{ width: 32, height: 32, marginRight: 13 }}
          />
          <Text style={styles.signInWithEmailText}>Sign in with Email</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Forgot Password</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
    alignItems: "center",
    paddingVertical: 60,
  },
  headerWrapper: {
    alignItems: "center",
    marginTop: "5%",
  },
  title: {
    color: "white",
    textAlign: "center",
    fontFamily: "InriaSerif_700Bold",
    fontSize: 48,
  },
  subTitle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Montserrat_700Bold",
    fontSize: 17,
    letterSpacing: -0.85,
    marginTop: 5,
  },
  imageWrapper: {
    width: "100%",
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  backgroundImage: {
    width: "85%",
    aspectRatio: 1,
  },
  bottomWrapper: {
    alignItems: "center",
    marginTop: "auto",
    marginBottom: "15%",
  },
  signInWithEmailButton: {
    width: 313,
    height: 49,
    backgroundColor: colors.secondary,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  signInWithEmailText: {
    color: "white",
    fontFamily: "SF Pro",
    fontSize: 19,
    fontWeight: "600",
  },
  forgotPasswordText: {
    color: "white",
    fontFamily: "SF Pro",
    fontSize: 16,
    fontWeight: "500",
    textDecorationLine: "underline",
    marginTop: 12,
  },
});
