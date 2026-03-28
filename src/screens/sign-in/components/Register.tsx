import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../../../lib/supabase";
import colors from "../../../theme/colors";

type RegisterProps = {
  onBack: () => void;
};

export function Register({ onBack }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const validate = () => {
    const newErrors = {
      email: !email.trim(),
      password: !password.trim() || password.length < 6,
      confirmPassword: !confirmPassword.trim() || confirmPassword !== password,
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  async function handleSignUp() {
    if (!validate()) return;
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({ email, password });
    if (error) {
      setErrors({ email: true, password: true, confirmPassword: true });
    } else if (!session) {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Email {errors.email && <Text style={styles.error}>*</Text>}
        </Text>
        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors((e) => ({ ...e, email: false }));
          }}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Password {errors.password && <Text style={styles.error}>*</Text>}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (errors.password)
                setErrors((e) => ({ ...e, password: false }));
            }}
            secureTextEntry={!showPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#999"
            autoCapitalize="none"
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setShowPassword((p) => !p)}
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Confirm Password{" "}
          {errors.confirmPassword && <Text style={styles.error}>*</Text>}
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            value={confirmPassword}
            onChangeText={(text) => {
              setConfirmPassword(text);
              if (errors.confirmPassword)
                setErrors((e) => ({ ...e, confirmPassword: false }));
            }}
            secureTextEntry={!showConfirmPassword}
            placeholder="At least 6 characters"
            placeholderTextColor="#999"
            autoCapitalize="none"
            style={styles.passwordInput}
          />
          <TouchableOpacity
            onPress={() => setShowConfirmPassword((p) => !p)}
            style={styles.iconButton}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showConfirmPassword ? "eye-off" : "eye"}
              size={22}
              color={showConfirmPassword ? "#666" : "#bbb"}
            />
          </TouchableOpacity>
        </View>
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

      {success && (
        <Text style={styles.successText}>
          Check your email to verify your account.
        </Text>
      )}

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
  successText: {
    marginTop: 16,
    textAlign: "center",
    color: colors.primary,
    fontWeight: "600",
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
