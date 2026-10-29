import { Link, Stack } from "expo-router";
import { View, Text } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Ops!" }} />
      <View className="flex-1 items-center justify-center bg-gray-900 p-6">
        <Text className="text-xl font-bold text-white mb-4">
          Esta tela não existe.
        </Text>
        <Link href="/" className="text-lime-400 font-semibold">
          Voltar para o início
        </Link>
      </View>
    </>
  );
}
