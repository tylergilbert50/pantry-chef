import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";
import * as Linking from "expo-linking";
import colors from "../../../theme/colors";
import { supabase } from "../../../lib/supabase";

const redirectUrl = Linking.createURL("callback");

type Props = {
  onFocusEmail: () => void;
  setIsEditingEmail: (value: boolean) => void;
};

export function AccountCard({ onFocusEmail, setIsEditingEmail }: Props) {
  const [showEmailInput, setShowEmailInput] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsEditingEmail(showEmailInput);
  }, [showEmailInput]);

  function toggleEmailInput() {
    setShowEmailInput((prev) => !prev);
  }

  async function handleChangeEmail() {
    if (!newEmail) return;
    setLoading(true);

    const { error } = await supabase.auth.updateUser(
      { email: newEmail },
      { emailRedirectTo: redirectUrl },
    );

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert(
        "Check your email",
        "Please confirm the change from both your old and new email.",
      );
      setShowEmailInput(false);
      setNewEmail("");
    }

    setLoading(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} onPress={toggleEmailInput}>
        <Text style={styles.cardText}>Change Email</Text>
      </TouchableOpacity>

      {showEmailInput && (
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Enter new email"
            value={newEmail}
            onChangeText={setNewEmail}
            onFocus={onFocusEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            style={styles.input}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.disabled]}
            onPress={handleChangeEmail}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Updating..." : "Update Email"}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity style={styles.row}>
        <Text style={styles.cardText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.row} onPress={handleLogout}>
        <Text style={styles.logout}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "90%",
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: colors.black,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  row: {
    paddingVertical: 12,
  },
  cardText: {
    fontSize: 16,
    color: colors.black,
  },
  logout: {
    fontSize: 16,
    color: "#EF4444",
    fontWeight: "500",
  },
  inputWrapper: {
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: colors.white,
    fontWeight: "600",
  },
});
