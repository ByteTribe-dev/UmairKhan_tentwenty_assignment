import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide splash screen after a short delay
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 1000);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="movie/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="booking/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="seats/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
