import { useEffect, useState } from "react";
import { useFonts, InriaSerif_700Bold } from "@expo-google-fonts/inria-serif";
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import { supabase } from "./src/lib/supabase";
import { RootNavigator } from "./src/navigation/RootNavigator";

export default function App() {
  const [fontsLoaded] = useFonts({
    InriaSerif_700Bold,
    Montserrat_400Regular,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
  });

  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setInitializing(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(() => {
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (!fontsLoaded || initializing) {
    return null;
  }

  return <RootNavigator />;
}
