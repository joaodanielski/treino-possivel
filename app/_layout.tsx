import "../global.css";
import { View } from "react-native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      {/* Na web, limita a largura à de um celular e centraliza; no celular não muda nada. */}
      <View style={{ flex: 1, backgroundColor: "#030712", alignItems: "center" }}>
        <View style={{ flex: 1, width: "100%", maxWidth: 480 }}>
          <Stack
            screenOptions={{
              headerStyle: { backgroundColor: "#030712" },
              headerTintColor: "#f9fafb",
              contentStyle: { backgroundColor: "#111827" },
              headerBackTitle: "Voltar",
              // headerBackTitleVisible: false, // Descomente esta linha se quiser exibir APENAS a seta (<) sem texto
            }}
          >
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
                title: "Início", // Define o nome da rota pai para não assumir "(tabs)"
              }}
            />
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
        </View>
      </View>
    </>
  );
}
