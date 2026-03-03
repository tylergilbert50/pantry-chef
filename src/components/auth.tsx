import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../lib/supabaseClient";
import colors from "../theme/colors";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    if (error) Alert.alert(error.message);
    if (!session)
      Alert.alert("Please check your inbox for email verification!");
    setLoading(false);
  }

  async function handleForgotPassword() {
    if (!email) {
      Alert.alert("Enter your email first.");
      return;
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "pantrychef://reset-password",
    });

    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Password reset email sent!");
    }
  }
  return (
    <View>
      <View>
        <Text style={styles.label}>Email</Text>
        <TextInput
          onChangeText={(text) => setEmail(text)}
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
      </View>
      <View>
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            onChangeText={(text) => setPassword(text)}
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
      </View>
      <TouchableOpacity
        onPress={handleForgotPassword}
        style={styles.forgotPassword}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <View>
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={() => signInWithEmail()}
          disabled={loading}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "Black",
    marginBottom: 6,
    marginTop: 40,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ADADAD",
    fontFamily: "Montserrat_400",
    paddingHorizontal: 0,
    padding: 12,
    fontSize: 16,
    marginBottom: -10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
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
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: 50,
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#8A8A8A",
    fontFamily: "Montserrat_400",
  },
});
