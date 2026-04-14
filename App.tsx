import { useEffect, useState } from "react";
import { useFonts, InriaSerif_700Bold } from "@expo-google-fonts/inria-serif";
import {
  Montserrat_700Bold,
  Montserrat_600SemiBold,
  Montserrat_400Regular,
} from "@expo-google-fonts/montserrat";
import { supabase } from "./src/lib/supabase";
import { RootNavigator } from "./src/navigation/RootNavigator";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 60, // 1 hour. After 1 hour, cached values become invalid.
            gcTime: 1000 * 60 * 60,
            refetchOnMount: false,
            refetchOnWindowFocus: false,
            refetchOnReconnect: false,
        },
    },
})

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

  return (
    <QueryClientProvider client={queryClient}>
      <RootNavigator />
    </QueryClientProvider>
  );
  /*
  // RootNavigator controls whether the user sees
  // the authentication flow or the main app
  return <Recipes
    title={"Chicken Fried Rice"} recipeType={"Lunch / Dinner / Breakfast / Snack"}
    detailCards={{
      "Calories": "350",
      "Carbs": "36/g",
      "Fats": "44/g",
      "Protein": "30/g"
    }}
    textIntro="This is a recipe for basic fried rice. Total estimated cooking time is 2 hours."
    ingredients={{items: ["3 cups Jasmine rice","4 lbs Chicken", "5 carrots", "2 bunches green onions", "Frozen peas", "Sesame seed oil", "Soy sauce"]}}
    bodyText="Rinse the rice until the water runs clear. Place rice in rice cooker and start the rice cooker. Dice carrot and green onions."
    /> //<RootNavigator session={session} />;
    */;
}
