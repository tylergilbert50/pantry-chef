import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { supabase } from "../../lib/supabaseClient";
import colors from "../../theme/colors";

export const Register: React.FC = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  return (
    <View>
      <Text style={styles.label}>Email</Text>
      <TextInput
        onChangeText={setEmail}
        value={email}
        placeholder="Enter your email"
        autoCapitalize="none"
        style={styles.input}
        underlineColorAndroid="transparent"
        keyboardType="email-address"
        autoCorrect={false}
        textContentType="emailAddress"
        autoComplete="email"
        returnKeyType="next"
      />
      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordContainer}>
        <TextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry={!showPassword}
          placeholder="Enter your password"
          autoCapitalize="none"
          style={[styles.input, { flex: 1 }]}
          underlineColorAndroid="transparent"
        />
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleText}>
            {showPassword ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginLink} onPress={() => navigation.goBack()}>
            Login here
          </Text>
        </Text>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "black",
    marginBottom: 6,
    marginTop: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ADADAD",
    fontFamily: "Montserrat_400",
    padding: 12,
    paddingHorizontal: 0,
    fontSize: 16,
    width: 315,
    marginBottom: -10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    width: 315,
  },
  toggleButton: {
    position: "absolute",
    right: 0,
    bottom: 4,
  },
  toggleText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: "600",
  },
  button: {
    backgroundColor: colors.secondary,
    borderRadius: 50,
    padding: 12,
    alignItems: "center",
    marginTop: 45,
    width: 315,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  loginContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  loginText: {
    fontSize: 16,
    fontFamily: "Montserrat_400",
  },
  loginLink: {
    color: colors.secondary,
    fontWeight: "600",
  },
});
