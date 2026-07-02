import { SplashScreen, Stack } from "expo-router";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import { StyleSheet, Text } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import ThemeProvider from "@/context/theme-provider";
import { useTheme } from "@/hooks/use-theme";
import { ThemeType } from "@/types/theme-types";

export default function RootLayout() {


  const [loaded, error] = useFonts({
    "Iceberg-Regular": require("@/assets/fonts/Iceberg/Iceberg-Regular.ttf"),
    "Hind-Regular": require("@/assets/fonts/Hind/Hind-Regular.ttf"),
    "Hind-Medium": require("@/assets/fonts/Hind/Hind-Medium.ttf"),
    "Hind-SemiBold": require("@/assets/fonts/Hind/Hind-SemiBold.ttf"),
    "Hind-Bold": require("@/assets/fonts/Hind/Hind-Bold.ttf"),
    "Hind-Light": require("@/assets/fonts/Hind/Hind-Light.ttf"),
    "Imprima-Regular": require("@/assets/fonts/Imprima/Imprima-Regular.ttf"),
  })

  
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error])

  if (!loaded) {
    return <Text>Loading...</Text>
  }
  if (error) {
    return <Text>Error loading fonts</Text>
  }
  return (
    <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="signup/page" options={{ headerShown: false }} />
          <Stack.Screen name="signin/page" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
    </ThemeProvider>
  )
}


