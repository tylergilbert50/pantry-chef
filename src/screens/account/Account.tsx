import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import colors from "../../theme/colors";
import { useUser } from "../../context/UserContext";
import { PreferencesCard } from "../../screens/account/components/PreferencesCard";
import { AccountCard } from "../../screens/account/components/AccountCard";

type AccountProps = {
  onRestartOnboarding: () => void;
};

export function Account({ onRestartOnboarding }: AccountProps) {
  const { profile, session } = useUser();
  const scrollRef = useRef<ScrollView>(null);

  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  function scrollUp() {
    scrollRef.current?.scrollTo({ y: 350, animated: true });
  }

  function scrollToTop() {
    scrollRef.current?.scrollTo({ y: 0, animated: true });
  }

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });

    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  useEffect(() => {
    if (!isEditingEmail) {
      scrollToTop();
    }
  }, [isEditingEmail]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={styles.container}>
        <View style={styles.header} />

        <View style={styles.profileWrapper}>
          <View style={styles.profileCard}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=12" }}
              style={styles.avatar}
            />
            <View>
              <Text style={styles.name}>
                {profile
                  ? `${profile.first_name ?? ""} ${
                      profile.last_name ?? ""
                    }`.trim() || "No Name"
                  : "No Name"}
              </Text>
              <Text style={styles.email}>{session?.user?.email}</Text>
            </View>
          </View>
        </View>

        <ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={isEditingEmail && !keyboardVisible}
        >
          <View style={styles.topSpacer} />

          <Text style={styles.sectionTitle}>Preferences</Text>
          <PreferencesCard />

          <Text style={styles.sectionTitle}>Account</Text>

          <AccountCard
            onFocusEmail={scrollUp}
            setIsEditingEmail={setIsEditingEmail}
            onRestartOnboarding={onRestartOnboarding}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    position: "absolute",
    width: 900,
    height: 900,
    borderRadius: 325,
    top: -790,
    alignSelf: "center",
    backgroundColor: colors.primary,
    zIndex: 5,
  },
  profileWrapper: {
    position: "absolute",
    top: 70,
    width: "90%",
    alignSelf: "center",
    zIndex: 10,
  },
  content: {
    paddingBottom: 60,
    alignItems: "center",
  },
  topSpacer: {
    height: 155,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 70,
    shadowColor: colors.black,
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.black,
  },
  email: {
    fontSize: 13,
    color: "#777",
  },
  sectionTitle: {
    width: "90%",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    color: colors.black,
  },
});
