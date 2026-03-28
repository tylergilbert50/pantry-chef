import React, { useState } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import colors from "../../../theme/colors";
import { Auth } from "../../../components/auth";
import { ForgotPassword } from "../components/ForgotPassword";
import { Register } from "../components/Register";
import PantryChefIcon from "../../../../assets/icons/pantrychef-icon.svg";

export const SignInWithEmail: React.FC = () => {
  const [view, setView] = useState<"login" | "forgot" | "register">("login");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>PantryChef</Text>
      <PantryChefIcon width={160} height={160} marginTop={20} />
      {view === "login" && (
        <Auth
          onForgot={() => setView("forgot")}
          onRegister={() => setView("register")}
        />
      )}
      {view === "forgot" && <ForgotPassword onBack={() => setView("login")} />}
      {view === "register" && <Register onBack={() => setView("login")} />}
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
});
