import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Mock do treino gerado pela IA (Futuramente virá via parâmetro)
const TREINO_MOCK = [
  { id: "1", nome: "Flexão de Braços", series: "3x12", concluido: false },
  { id: "2", nome: "Agachamento Livre", series: "4x15", concluido: false },
  { id: "3", nome: "Prancha Abdominal", series: "3x45s", concluido: false },
];

export default function Execucao() {
  const router = useRouter();
  const [exercicios, setExercicios] = useState(TREINO_MOCK);

  // Estados do Cronômetro
  const [segundos, setSegundos] = useState(0);
  const [ativo, setAtivo] = useState(false);

  // Lógica do Cronômetro
  useEffect(() => {
    let intervalo: ReturnType<typeof setInterval>;
    if (ativo) {
      intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    }
    return () => clearInterval(intervalo);
  }, [ativo]);

  const formatarTempo = (totalSegundos: number) => {
    const min = Math.floor(totalSegundos / 60)
      .toString()
      .padStart(2, "0");
    const seg = (totalSegundos % 60).toString().padStart(2, "0");
    return `${min}:${seg}`;
  };

  const alternarExercicio = (id: string) => {
    setExercicios(
      exercicios.map((ex) =>
        ex.id === id ? { ...ex, concluido: !ex.concluido } : ex,
      ),
    );
  };

  const finalizarTreino = async () => {
    // Verifica se todos foram marcados (Opcional, apenas para alertar)
    const todosConcluidos = exercicios.every((ex) => ex.concluido);
    if (!todosConcluidos) {
      Alert.alert(
        "Atenção",
        "Você não marcou todos os exercícios. Deseja finalizar mesmo assim?",
        [
          { text: "Cancelar", style: "cancel" },
          { text: "Sim, finalizar", onPress: salvarEVoltar },
        ],
      );
      return;
    }
    salvarEVoltar();
  };

  const salvarEVoltar = async () => {
    try {
      // Salva um registro simples no AsyncStorage para provar o conceito
      const novoTreino = {
        id: Date.now().toString(),
        data: new Date().toLocaleDateString("pt-BR"),
        titulo: "Treino Adaptado IA",
      };

      const historicoAntigo = await AsyncStorage.getItem("@historico_treinos");
      const historicoParseado = historicoAntigo
        ? JSON.parse(historicoAntigo)
        : [];
      historicoParseado.unshift(novoTreino); // Adiciona no topo da lista

      await AsyncStorage.setItem(
        "@historico_treinos",
        JSON.stringify(historicoParseado),
      );

      Alert.alert("Parabéns!", "Treino finalizado e salvo no histórico.");

      // Volta para a aba de histórico
      router.push("/(tabs)/historico");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar o treino.");
    }
  };

  return (
    <View className="flex-1 bg-gray-50 pt-12">
      {/* Cabeçalho */}
      <View className="flex-row justify-between items-center px-6 mb-6">
        <Text className="text-2xl font-bold text-gray-800">Treino Ativo</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="p-2 bg-gray-200 rounded-full"
        >
          <Ionicons name="close" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      {/* Cronômetro */}
      <View className="items-center mb-8">
        <Text className="text-6xl font-light text-gray-800">
          {formatarTempo(segundos)}
        </Text>
        <View className="flex-row mt-4 space-x-4">
          <TouchableOpacity
            onPress={() => setAtivo(!ativo)}
            className={`px-8 py-3 rounded-full flex-row items-center ${ativo ? "bg-orange-100" : "bg-green-100"}`}
          >
            <Ionicons
              name={ativo ? "pause" : "play"}
              size={20}
              color={ativo ? "#ea580c" : "#16a34a"}
              className="mr-2"
            />
            <Text
              className={`font-bold ${ativo ? "text-orange-600" : "text-green-600"}`}
            >
              {ativo ? "Pausar" : "Iniciar"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setAtivo(false);
              setSegundos(0);
            }}
            className="px-6 py-3 rounded-full bg-gray-200 justify-center"
          >
            <Text className="text-gray-700 font-bold">Zerar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Checklist de Exercícios */}
      <ScrollView className="flex-1 px-6">
        <Text className="text-lg font-bold text-gray-800 mb-4">
          Seu Plano Adaptado
        </Text>

        {exercicios.map((ex) => (
          <TouchableOpacity
            key={ex.id}
            onPress={() => alternarExercicio(ex.id)}
            className={`p-4 rounded-xl mb-3 flex-row items-center border ${ex.concluido ? "bg-green-50 border-green-200" : "bg-white border-gray-200 shadow-sm"}`}
          >
            <Ionicons
              name={ex.concluido ? "checkmark-circle" : "ellipse-outline"}
              size={28}
              color={ex.concluido ? "#10b981" : "#d1d5db"}
              className="mr-3"
            />
            <View className="flex-1">
              <Text
                className={`text-lg font-bold ${ex.concluido ? "text-green-800 line-through" : "text-gray-800"}`}
              >
                {ex.nome}
              </Text>
              <Text
                className={`${ex.concluido ? "text-green-600" : "text-gray-500"}`}
              >
                {ex.series}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Botão Finalizar */}
      <View className="p-6 bg-white border-t border-gray-100">
        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl items-center flex-row justify-center shadow-lg shadow-blue-300"
          onPress={finalizarTreino}
        >
          <Ionicons name="trophy-outline" size={24} color="white" />
          <Text className="text-white font-bold text-lg ml-2">
            Finalizar Treino
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
