import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="treino/geracao-ia"
        options={{ presentation: "modal", title: "Plano IA" }}
      />
      <Stack.Screen
        name="treino/execucao"
        options={{
          presentation: "modal",
          title: "Treino Ativo",
          headerShown: false,
        }}
      />
      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
