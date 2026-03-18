import React, { useState } from "react";
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import colors from "../../../theme/colors";

type RegisterProps = {
  onBack: () => void;
};

export function Register({ onBack }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Sign Up Error", error.message);
    } else if (!session) {
      Alert.alert(
        "Check Your Email",
        "We've sent you a verification link. Please check your inbox to confirm your account.",
      );
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Create Account</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="At least 6 characters"
          placeholderTextColor="#999"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
          placeholderTextColor="#999"
          autoCapitalize="none"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={[styles.signUpButton, loading && styles.buttonDisabled]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.signUpButtonText}>
          {loading ? "Creating account..." : "Sign Up"}
        </Text>
      </TouchableOpacity>

      <View style={styles.loginRow}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={onBack}>
          <Text style={styles.loginLink}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signUpButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  loginText: {
    color: "#777",
    fontSize: 14,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
