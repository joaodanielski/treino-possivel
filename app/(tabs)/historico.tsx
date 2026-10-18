import { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Historico() {
  const [historico, setHistorico] = useState<
    { id: string; data: string; titulo: string }[]
  >([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    carregarHistorico();
  }, []);

  const carregarHistorico = () => {
    setCarregando(true);
    setErro(false);

    setTimeout(async () => {
      try {
        const historicoSalvo = await AsyncStorage.getItem("@historico_treinos");
        if (historicoSalvo) {
          setHistorico(JSON.parse(historicoSalvo));
        } else {
          setHistorico([]);
        }
      } catch (e) {
        setErro(true);
      } finally {
        setCarregando(false);
      }
    }, 1000);
  };

  // 1. Estado de Carregamento
  if (carregando) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 mt-4">
          Buscando seus treinos passados...
        </Text>
      </View>
    );
  }

  // 2. Estado de Erro
  if (erro) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#ef4444" />
        <Text className="text-lg font-bold text-gray-800 mt-4 text-center">
          Ops! Algo deu errado.
        </Text>
        <Text className="text-gray-500 text-center mt-2 mb-6">
          Não foi possível carregar o seu histórico.
        </Text>
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded-lg"
          onPress={carregarHistorico}
        >
          <Text className="text-white font-bold">Tentar Novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // 3. Estado de Lista Vazia
  if (historico.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 p-6">
        <Ionicons name="barbell-outline" size={64} color="#9ca3af" />
        <Text className="text-xl font-bold text-gray-800 mt-4 text-center">
          Nenhum treino registrado
        </Text>
        <Text className="text-gray-500 text-center mt-2">
          Você ainda não concluiu nenhum treino. Vá para a Home e inicie o seu
          primeiro desafio!
        </Text>
      </View>
    );
  }

  // 4. Estado de Listagem (Sucesso)
  return (
    <View className="flex-1 bg-gray-50 p-4 pt-12">
      <Text className="text-3xl font-bold mb-6 text-gray-800">Histórico</Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-xl mb-4 shadow-sm border border-gray-100 flex-row items-center">
            <Ionicons
              name="checkmark-circle"
              size={32}
              color="#10b981"
              className="mr-4"
            />
            <View>
              <Text className="font-bold text-lg text-gray-800">
                {item.titulo}
              </Text>
              <Text className="text-gray-500 mt-1">
                Concluído em: {item.data}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}
