import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { supabase } from "../../../lib/supabase";
import colors from "../../../theme/colors";

type ForgotPasswordProps = {
  onBack: () => void;
};

export function ForgotPassword({ onBack }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: false });
  const [success, setSuccess] = useState(false);

  async function handleReset() {
    const newErrors = { email: !email.trim() };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      setErrors({ email: true });
    } else {
      setSuccess(true);
    }

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.description}>
        Enter the email address associated with your account and we'll send you
        a link to reset your password.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Email {errors.email && <Text style={styles.error}>* Please enter a valid email </Text>}
        </Text>
        <TextInput
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors({ email: false });
          }}
          placeholder="Email"
          placeholderTextColor="#999"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleReset}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>

      {success && (
        <Text style={styles.successText}>
          Reset link sent! Check your email.
        </Text>
      )}

      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>Back to Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#333",
  },
  description: {
    fontSize: 14,
    color: "#777",
    lineHeight: 20,
    marginBottom: 12,
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
  error: {
    color: "red",
    fontWeight: "700",
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
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
  backButton: {
    marginTop: 20,
    alignItems: "center",
  },
  backText: {
    color: "#777",
    fontSize: 14,
  },
});
