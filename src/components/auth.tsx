import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";
import colors from "../theme/colors";

type AuthProps = {
  onForgot: () => void;
  onRegister: () => void;
};

export function Auth({ onForgot, onRegister }: AuthProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: false,
    password: false,
  });

  async function signInWithEmail() {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim(),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrors({
        email: true,
        password: true,
      });
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      {/* EMAIL */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Email {errors.email && <Text style={styles.error}>*</Text>}
        </Text>
        <TextInput
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((e) => ({ ...e, email: false }));
          }}
          value={email}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      {/* PASSWORD */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Password {errors.password && <Text style={styles.error}>*</Text>}
        </Text>

        <View style={styles.passwordContainer}>
          <TextInput
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors((e) => ({ ...e, password: false }));
            }}
            value={password}
            secureTextEntry={!showPassword}
            placeholder="Password"
            placeholderTextColor="#999"
            autoCapitalize="none"
            style={styles.passwordInput}
          />

          <TouchableOpacity
            onPress={() => setShowPassword((prev) => !prev)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color={showPassword ? "#666" : "#bbb"}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* FORGOT */}
      <TouchableOpacity onPress={onForgot} style={styles.forgotButton}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </TouchableOpacity>

      {/* BUTTON */}
      <TouchableOpacity
        style={[styles.signInButton, loading && styles.buttonDisabled]}
        onPress={signInWithEmail}
        disabled={loading}
      >
        <Text style={styles.signInButtonText}>
          {loading ? "Signing in..." : "Sign In"}
        </Text>
      </TouchableOpacity>

      {/* REGISTER */}
      <View style={styles.registerRow}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={onRegister}>
          <Text style={styles.registerLink}>Sign Up</Text>
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    paddingRight: 6,
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 16,
  },
  iconButton: {
    padding: 10,
  },
  error: {
    color: "red",
    fontWeight: "700",
  },
  forgotButton: {
    alignSelf: "center",
    marginBottom: 24,
  },
  forgotText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  signInButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  registerText: {
    color: "#777",
    fontSize: 14,
  },
  registerLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "700",
  },
});
