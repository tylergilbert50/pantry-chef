import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { useFonts, InriaSerif_700Bold } from "@expo-google-fonts/inria-serif";
import { Montserrat_700Bold } from "@expo-google-fonts/montserrat";
import { supabase } from "./src/lib/supabaseClient";
import { Navbar } from "./src/components/Navbar";

export default function App() {
  // Load required fonts before rendering the app
  const [fontsLoaded] = useFonts({
    InriaSerif_700Bold,
    Montserrat_700Bold,
  });

  // Holds the current Supabase authentication session
  const [session, setSession] = useState<Session | null>(null);

  // Prevents navigation from rendering before auth state is determined
  const [initializing, setInitializing] = useState(true);

  // Initialize authentication state on app load
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setInitializing(false);
    });

    // Subscribe to authentication state changes (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      },
    );

    // Clean up the auth listener when the app unmounts
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Prevent rendering until fonts and auth state are ready
  if (!fontsLoaded || initializing) {
    return null;
  }

  // RootNavigator controls whether the user sees
  // the authentication flow or the main app
  return <Navbar/>;
}
