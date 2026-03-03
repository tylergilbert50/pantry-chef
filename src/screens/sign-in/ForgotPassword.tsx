import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabaseClient";
import colors from "../../theme/colors";

type Props = {
  onBack: () => void;
};

export const ForgotPassword: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email) {
      Alert.alert("Enter your email first.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "pantrychef://reset-password",
    });
    if (error) {
      Alert.alert(error.message);
    } else {
      Alert.alert("Password reset email sent!");
    }
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
        keyboardType="email-address"
      />
      <TouchableOpacity
        style={[styles.button, loading && { opacity: 0.5 }]}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text style={styles.buttonText}>Send Reset Email</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onBack} style={styles.back}>
        <Text style={styles.backText}>Back to Login</Text>
      </TouchableOpacity>
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
  back: {
    marginTop: 25,
    alignItems: "center",
  },
  backText: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: "600",
    fontFamily: "Montserrat_400",
  },
});
