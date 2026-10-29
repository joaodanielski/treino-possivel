import { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, Pressable } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { carregarHistorico } from "@/lib/storage";
import { diaDaSemana, diaDoMes, formatarDuracao } from "@/lib/format";
import type { TreinoRegistro } from "@/lib/types";

export default function Historico() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [historico, setHistorico] = useState<TreinoRegistro[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(false);
    try {
      setHistorico(await carregarHistorico());
    } catch {
      setErro(true);
    } finally {
      setCarregando(false);
    }
  }, []);

  // Recarrega ao voltar para a aba: um treino pode ter sido finalizado ou excluído.
  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  if (carregando) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#a3e635" />
        <Text className="text-gray-400 mt-4">
          Buscando seus treinos passados...
        </Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#f87171" />
        <Text className="text-lg font-bold text-white mt-4 text-center">
          Ops! Algo deu errado.
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-6">
          Não foi possível carregar o seu histórico.
        </Text>
        <Pressable
          className="bg-lime-400 px-6 py-3 rounded-xl"
          onPress={carregar}
        >
          <Text className="text-gray-900 font-bold">Tentar novamente</Text>
        </Pressable>
      </View>
    );
  }

  if (historico.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900 p-6">
        <Ionicons name="barbell-outline" size={64} color="#6b7280" />
        <Text className="text-xl font-bold text-white mt-4 text-center">
          Nenhum treino registrado
        </Text>
        <Text className="text-gray-400 text-center mt-2">
          Você ainda não concluiu nenhum treino. Vá para o Início e gere o
          primeiro!
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900 px-5" style={{ paddingTop: insets.top + 16 }}>
      <Text className="text-xs font-semibold uppercase tracking-widest text-lime-400 mb-2">
        Atividade
      </Text>
      <Text className="text-3xl font-bold text-white mb-1">Seu histórico</Text>
      <Text className="text-gray-400 mb-6">
        Acompanhe sua jornada, um treino por vez.
      </Text>
      <FlatList
        data={historico}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 24, gap: 12 }}
        renderItem={({ item }) => {
          const completo = item.status === "Concluído";
          return (
            <Pressable
              className="flex-row items-center bg-gray-800 rounded-2xl p-4 border border-white/10"
              onPress={() =>
                router.push({ pathname: "/treino/[id]", params: { id: item.id } })
              }
            >
              <View className="w-11 h-11 rounded-xl bg-gray-700 items-center justify-center mr-3">
                <Text className="text-white font-bold text-lg leading-5">
                  {diaDoMes(item.dataISO)}
                </Text>
                <Text className="text-gray-400 text-[10px]">
                  {diaDaSemana(item.dataISO)}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-gray-100 font-semibold" numberOfLines={1}>
                  {item.titulo}
                </Text>
                <Text
                  className={`text-xs font-medium mt-1 ${
                    completo ? "text-green-400" : "text-yellow-400"
                  }`}
                >
                  {item.status} · {item.seriesConcluidas}/{item.seriesTotais} séries ·{" "}
                  {formatarDuracao(item.duracaoSegundos)}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={18} color="#6b7280" />
            </Pressable>
          );
        }}
      />
    </View>
  );
}
