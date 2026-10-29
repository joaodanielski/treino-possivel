import { useEffect, useRef, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { gerarPlanoMock, substituirExercicioMock } from "@/lib/mock-plano";
import { primeiro } from "@/lib/params";
import { OBJETIVOS, type Objetivo, type Plano } from "@/lib/types";

export default function PlanoTreino() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{
    tempo?: string;
    equipamentos?: string;
    objetivo?: string;
  }>();

  // Valores recebidos por parâmetro, com fallback caso a rota seja aberta sem eles.
  const minutos = Number(primeiro(params.tempo)) || 30;
  const equipamentos = (primeiro(params.equipamentos) ?? "Peso corporal")
    .split(",")
    .filter(Boolean);
  const objetivoParam = primeiro(params.objetivo);
  const objetivo: Objetivo =
    OBJETIVOS.find((o) => o === objetivoParam) ?? "Hipertrofia";

  const [plano, setPlano] = useState<Plano>(() =>
    gerarPlanoMock({ minutos, equipamentos, objetivo }),
  );
  const [substituindo, setSubstituindo] = useState<string | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    },
    [],
  );

  const substituir = (id: string) => {
    const atual = plano.exercicios.find((e) => e.id === id);
    if (!atual || substituindo) return;
    const nova = substituirExercicioMock(
      atual,
      equipamentos,
      plano.exercicios.map((e) => e.nome),
    );
    if (!nova) {
      Alert.alert(
        "Sem alternativas",
        "Não há outro exercício disponível para os equipamentos escolhidos.",
      );
      return;
    }
    setSubstituindo(id);
    // Simula o pedido de substituição pontual à LLM (RF03).
    temporizador.current = setTimeout(() => {
      setPlano((p) => ({
        ...p,
        exercicios: p.exercicios.map((e) => (e.id === id ? nova : e)),
      }));
      setSubstituindo(null);
    }, 900);
  };

  const iniciar = () =>
    router.push({
      pathname: "/treino/execucao",
      params: {
        titulo: plano.titulo,
        exercicios: JSON.stringify(plano.exercicios),
      },
    });

  return (
    <View className="flex-1 bg-gray-900">
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="self-start flex-row items-center px-4 py-2 rounded-full border border-lime-400/50 bg-lime-400/10 mb-5">
          <Ionicons name="sparkles" size={16} color="#a3e635" />
          <Text className="text-lime-300 font-semibold text-sm ml-2">
            Gerado por IA (simulado)
          </Text>
        </View>

        <Text className="text-2xl font-bold text-white">{plano.titulo}</Text>
        <Text className="text-gray-400 text-sm mt-2 mb-6">{plano.descricao}</Text>

        <View className="gap-3">
          {plano.exercicios.map((ex) => (
            <View
              key={ex.id}
              className="rounded-2xl bg-gray-800 border border-white/10 p-4"
            >
              <Text className="text-white font-semibold text-base mb-3">
                {ex.nome}
              </Text>
              <View className="flex-row items-center mb-4">
                <Text className="text-gray-400 text-xs uppercase tracking-wide mr-2">
                  Séries
                </Text>
                <Text className="text-lime-400 font-bold text-lg mr-5">
                  {ex.series}
                </Text>
                <Text className="text-gray-400 text-xs uppercase tracking-wide mr-2">
                  Reps
                </Text>
                <Text className="text-lime-400 font-bold text-lg">{ex.reps}</Text>
              </View>
              <Pressable
                onPress={() => substituir(ex.id)}
                disabled={substituindo !== null}
                accessibilityLabel={`Substituir ${ex.nome}`}
                className="flex-row items-center justify-center py-3 rounded-xl border border-white/10 bg-gray-700"
              >
                {substituindo === ex.id ? (
                  <ActivityIndicator size="small" color="#a3e635" />
                ) : (
                  <>
                    <Ionicons name="swap-horizontal" size={16} color="#d1d5db" />
                    <Text className="text-gray-200 font-medium text-sm ml-2">
                      Substituir exercício
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        className="border-t border-white/10 bg-gray-900 px-6 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          className="bg-lime-400 h-14 rounded-2xl items-center flex-row justify-center"
          onPress={iniciar}
        >
          <Ionicons name="play" size={20} color="#111827" />
          <Text className="text-gray-900 font-bold text-base ml-2">
            Iniciar treino
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
