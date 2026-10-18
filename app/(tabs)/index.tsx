import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const [nome, setNome] = useState("");
  const router = useRouter();

  // O useFocusEffect garante que o nome atualize automaticamente
  // sempre que você voltar para a aba Home, sem precisar recarregar o app.
  useFocusEffect(
    useCallback(() => {
      const carregarNome = async () => {
        try {
          const nomeSalvo = await AsyncStorage.getItem("@perfil_nome");
          if (nomeSalvo) {
            setNome(nomeSalvo);
          } else {
            setNome("Atleta");
          }
        } catch (e) {
          setNome("Atleta");
        }
      };
      carregarNome();
    }, []),
  );

  return (
    <ScrollView className="flex-1 bg-gray-50 pt-12 px-6">
      <View className="mb-8 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-500 text-lg">Bem-vindo de volta,</Text>
          <Text className="text-3xl font-bold text-gray-800">{nome}!</Text>
        </View>
        <Ionicons name="person-circle-outline" size={48} color="#3b82f6" />
      </View>

      <View className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8">
        <View className="bg-blue-100 w-12 h-12 rounded-full items-center justify-center mb-4">
          <Ionicons name="sparkles" size={24} color="#3b82f6" />
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Seu Treino de Hoje
        </Text>
        <Text className="text-gray-500 mb-6">
          A Inteligência Artificial está pronta para montar o plano perfeito
          baseado no seu objetivo atual e equipamentos disponíveis.
        </Text>

        <TouchableOpacity
          className="bg-blue-500 py-4 rounded-xl items-center flex-row justify-center shadow-md shadow-blue-300"
          onPress={() => router.push("/treino/geracao-ia")}
        >
          <Ionicons name="play" size={20} color="white" className="mr-2" />
          <Text className="text-white font-bold text-lg ml-2">
            Gerar Treino com IA
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-lg font-bold text-gray-800 mb-4">Dica do Dia</Text>
      <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex-row items-center mb-10">
        <Ionicons
          name="information-circle"
          size={24}
          color="#3b82f6"
          className="mr-3"
        />
        <Text className="text-blue-800 flex-1 ml-2">
          Lembre-se: a consistência é mais importante que a carga. Faça o que é
          possível hoje!
        </Text>
      </View>
    </ScrollView>
  );
}
