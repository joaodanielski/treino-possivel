import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function GeracaoIA() {
  const router = useRouter();
  const [tempo, setTempo] = useState("30");
  const [equipamentos, setEquipamentos] = useState("Nenhum (Peso corporal)");
  const [gerando, setGerando] = useState(false);

  const simularGeracaoIA = () => {
    setGerando(true);

    // Simula os 2 segundos que a API da LLM levará para responder no futuro
    setTimeout(() => {
      setGerando(false);
      // Redireciona para a tela final onde o treino acontece
      router.push("/treino/execucao");
    }, 2000);
  };

  // Tela de Carregamento da IA
  if (gerando) {
    return (
      <View className="flex-1 bg-white justify-center items-center px-6">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-xl font-bold text-gray-800 mt-6 text-center">
          A IA está montando seu treino...
        </Text>
        <Text className="text-gray-500 mt-4 text-center">
          Cruzando seus objetivos com os equipamentos disponíveis hoje.
        </Text>
      </View>
    );
  }

  // Tela de Configuração do Prompt
  return (
    <ScrollView className="flex-1 bg-gray-50 p-6 pt-12">
      {/* Cabeçalho do Modal com botão de fechar */}
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-gray-800">Novo Treino</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <Text className="text-gray-600 mb-2 font-semibold ml-1">
        Tempo disponível (minutos)
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6 bg-white text-base"
        keyboardType="numeric"
        value={tempo}
        onChangeText={setTempo}
      />

      <Text className="text-gray-600 mb-2 font-semibold ml-1">
        O que você tem hoje?
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-8 bg-white text-base"
        placeholder="Ex: Par de halteres, elástico, sofá..."
        value={equipamentos}
        onChangeText={setEquipamentos}
      />

      <View className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-8">
        <View className="flex-row items-center mb-2">
          <Ionicons name="hardware-chip-outline" size={20} color="#3b82f6" />
          <Text className="text-blue-800 font-bold ml-2">Como funciona?</Text>
        </View>
        <Text className="text-blue-700 text-sm leading-5">
          O sistema ajustará a intensidade e os exercícios da sua rotina
          baseando-se estritamente no tempo e maquinário que você definiu acima.
        </Text>
      </View>

      <TouchableOpacity
        className="bg-blue-600 py-4 rounded-xl items-center flex-row justify-center shadow-lg shadow-blue-300"
        onPress={simularGeracaoIA}
      >
        <Ionicons name="color-wand-outline" size={24} color="white" />
        <Text className="text-white font-bold text-lg ml-2">
          Gerar e Começar
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
