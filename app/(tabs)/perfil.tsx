import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Perfil() {
  const [nome, setNome] = useState("");
  const [objetivo, setObjetivo] = useState("");
  const [carregando, setCarregando] = useState(true);

  // Executa automaticamente quando a tela abre para buscar os dados salvos
  useEffect(() => {
    carregarPerfil();
  }, []);

  const carregarPerfil = async () => {
    try {
      const nomeSalvo = await AsyncStorage.getItem("@perfil_nome");
      const objetivoSalvo = await AsyncStorage.getItem("@perfil_objetivo");

      if (nomeSalvo) setNome(nomeSalvo);
      if (objetivoSalvo) setObjetivo(objetivoSalvo);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os dados offline.");
    } finally {
      // Independente de dar erro ou sucesso, tira o ícone de carregamento
      setCarregando(false);
    }
  };

  const salvarPerfil = async () => {
    try {
      await AsyncStorage.setItem("@perfil_nome", nome);
      await AsyncStorage.setItem("@perfil_objetivo", objetivo);
      Alert.alert("Sucesso", "Seu perfil foi salvo offline com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  // Estado de Carregamento
  if (carregando) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-500 mt-4">Carregando seu perfil...</Text>
      </View>
    );
  }

  // Interface Principal
  return (
    <View className="flex-1 bg-white p-6 justify-center">
      <Text className="text-3xl font-bold mb-8 text-center text-gray-800">
        Seu Perfil
      </Text>

      <Text className="text-gray-600 mb-2 font-semibold ml-1">
        Nome ou Apelido
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-6 bg-gray-50 text-base"
        placeholder="Ex: João Victor"
        value={nome}
        onChangeText={setNome}
      />

      <Text className="text-gray-600 mb-2 font-semibold ml-1">
        Objetivo Principal (Ex: Hipertrofia)
      </Text>
      <TextInput
        className="border border-gray-300 rounded-lg p-4 mb-8 bg-gray-50 text-base"
        placeholder="O que você deseja alcançar?"
        value={objetivo}
        onChangeText={setObjetivo}
      />

      <TouchableOpacity
        className="bg-blue-500 p-4 rounded-xl items-center shadow-sm"
        onPress={salvarPerfil}
      >
        <Text className="text-white font-bold text-lg">Salvar Perfil</Text>
      </TouchableOpacity>
    </View>
  );
}
