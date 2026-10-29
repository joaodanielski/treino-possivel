import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#a3e635",
        tabBarInactiveTintColor: "#6b7280",
        tabBarStyle: { backgroundColor: "#030712", borderTopColor: "#1f2937" },
        sceneStyle: { backgroundColor: "#111827" },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Início",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="home" size={24} color={focused ? "#a3e635" : "#6b7280"} />
          ),
        }}
      />
      <Tabs.Screen
        name="historico"
        options={{
          title: "Histórico",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="time" size={24} color={focused ? "#a3e635" : "#6b7280"} />
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({ focused }) => (
            <Ionicons name="person" size={24} color={focused ? "#a3e635" : "#6b7280"} />
          ),
        }}
      />
    </Tabs>
  );
}
