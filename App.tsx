import { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { Session } from "@supabase/supabase-js";
import { useFonts, InriaSerif_700Bold } from "@expo-google-fonts/inria-serif";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { supabase } from "./src/lib/supabaseClient";
import { SignIn } from "./src/screens/sign-in/SignIn";

export default function App() {
  const [fontsLoaded] = useFonts({
    InriaSerif_700Bold,
    Montserrat_700Bold,
  });

  const [session, setSession] = useState<Session | null>(null);
  const [initializing, setInitializing] = useState(true);

  // Checks if user is logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitializing(false);
    });

    // Listens for login
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    // Prevents memory leaks when component unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Loading guard
  if (!fontsLoaded || initializing) {
    return null;
  }

  return (
    <View style={styles.container}>
      {session ? <View /> /* <- Change to <BarcodePage > later*/ : <SignIn />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
