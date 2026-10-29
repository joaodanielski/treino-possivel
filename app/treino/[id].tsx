import { useEffect, useState } from "react";
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { buscarTreino, removerTreino } from "@/lib/storage";
import { formatarData, formatarDuracao } from "@/lib/format";
import { primeiro } from "@/lib/params";
import type { TreinoRegistro } from "@/lib/types";

type Estado =
  | { tipo: "carregando" }
  | { tipo: "erro" }
  | { tipo: "naoEncontrado" }
  | { tipo: "ok"; treino: TreinoRegistro };

export default function DetalheTreino() {
  const router = useRouter();
  // Parâmetro dinâmico da rota: /treino/<id>
  const { id } = useLocalSearchParams<{ id?: string }>();
  const idTreino = primeiro(id);
  const [busca, setBusca] = useState<Estado>({ tipo: "carregando" });
  const estado: Estado = idTreino ? busca : { tipo: "naoEncontrado" };

  useEffect(() => {
    if (!idTreino) return;
    buscarTreino(idTreino)
      .then((treino) =>
        setBusca(treino ? { tipo: "ok", treino } : { tipo: "naoEncontrado" }),
      )
      .catch(() => setBusca({ tipo: "erro" }));
  }, [idTreino]);

  const excluir = () =>
    Alert.alert("Excluir treino?", "Esta ação não pode ser desfeita.", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            if (idTreino) await removerTreino(idTreino);
            router.back();
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o treino.");
          }
        },
      },
    ]);

  if (estado.tipo === "carregando") {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center">
        <ActivityIndicator size="large" color="#a3e635" />
      </View>
    );
  }

  if (estado.tipo !== "ok") {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#f87171" />
        <Text className="text-lg font-bold text-white mt-4 text-center">
          {estado.tipo === "erro"
            ? "Não foi possível carregar o treino."
            : "Treino não encontrado."}
        </Text>
        <Pressable
          className="bg-lime-400 px-6 py-3 rounded-xl mt-6"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const { treino } = estado;
  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentContainerStyle={{ padding: 24, paddingBottom: 40, gap: 16 }}
    >
      <View>
        <Text className="text-gray-400 text-sm">{formatarData(treino.dataISO)}</Text>
        <Text className="text-2xl font-bold text-white mt-1">{treino.titulo}</Text>
        <Text
          className={`text-sm font-semibold mt-2 ${
            treino.status === "Concluído" ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {treino.status} · {treino.seriesConcluidas}/{treino.seriesTotais} séries ·{" "}
          {formatarDuracao(treino.duracaoSegundos)}
        </Text>
      </View>

      {treino.exercicios.map((ex) => (
        <View
          key={ex.id}
          className="bg-gray-800 rounded-2xl border border-white/10 p-4"
        >
          <Text className="text-white font-bold text-base mb-2">{ex.nome}</Text>
          {ex.series.map((s, i) => (
            <View key={i} className="flex-row items-center py-1">
              <Ionicons
                name={s.concluida ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={s.concluida ? "#22c55e" : "#6b7280"}
              />
              <Text className="text-gray-300 text-sm ml-2">
                Série {i + 1}: {s.carga || "—"} kg × {s.reps || "—"} reps
              </Text>
            </View>
          ))}
        </View>
      ))}

      <Pressable
        onPress={excluir}
        className="flex-row items-center justify-center py-4 rounded-2xl border border-red-400/40 mt-2"
      >
        <Ionicons name="trash-outline" size={18} color="#f87171" />
        <Text className="text-red-400 font-semibold ml-2">Excluir treino</Text>
      </Pressable>
    </ScrollView>
  );
}
