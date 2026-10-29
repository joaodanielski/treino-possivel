import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#030712" },
          headerTintColor: "#f9fafb",
          contentStyle: { backgroundColor: "#111827" },
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="treino/geracao-ia"
          options={{ presentation: "modal", headerShown: false }}
        />
        <Stack.Screen
          name="treino/plano"
          options={{ title: "Plano de treino" }}
        />
        <Stack.Screen
          name="treino/execucao"
          options={{
            presentation: "modal",
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="treino/[id]"
          options={{ title: "Detalhes do treino" }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
    </>
  );
}
