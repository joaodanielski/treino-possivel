import { useCallback, useState } from "react";
import { View, Text, Pressable, ScrollView } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { carregarHistorico, carregarPerfil, PERFIL_PADRAO } from "@/lib/storage";
import { diaDaSemana, diaDoMes, formatarDuracao } from "@/lib/format";
import type { Perfil, TreinoRegistro } from "@/lib/types";

const SEMANA_MS = 7 * 24 * 60 * 60 * 1000;

export default function Home() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);
  const [historico, setHistorico] = useState<TreinoRegistro[]>([]);
  const [agora, setAgora] = useState(0);

  // Recarrega sempre que a aba ganha foco (ex.: depois de salvar o perfil ou finalizar um treino).
  useFocusEffect(
    useCallback(() => {
      (async () => {
        setAgora(Date.now());
        try {
          setPerfil(await carregarPerfil());
          setHistorico(await carregarHistorico());
        } catch {
          // Na Home, dados ilegíveis só significam "sem resumo"; o erro é tratado no Histórico.
          setHistorico([]);
        }
      })();
    }, []),
  );

  const concluidosNaSemana = historico.filter(
    (t) => agora - new Date(t.dataISO).getTime() < SEMANA_MS,
  ).length;
  const meta = Math.max(perfil.diasPorSemana, 1);
  const progresso = Math.min(100, Math.round((concluidosNaSemana / meta) * 100));
  const ultimo = historico[0];

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 24,
        paddingBottom: 32,
      }}
    >
      <View className="mb-6">
        <Text className="text-gray-400 text-base">Seu progresso</Text>
        <Text className="text-2xl font-bold text-white mt-1">
          Olá, {perfil.nome.trim() || "Atleta"}{" "}
          <Text className="text-lime-400">· {perfil.objetivo}</Text>
        </Text>
      </View>

      <View className="bg-gray-800 rounded-2xl p-4 border border-white/10 mb-6">
        <View className="flex-row justify-between mb-3">
          <Text className="text-gray-400 text-xs font-medium">
            Treinos nos últimos 7 dias
          </Text>
          <Text className="text-white text-xs font-medium">
            {concluidosNaSemana} de {meta}
          </Text>
        </View>
        <View className="h-2 rounded-full bg-gray-700 overflow-hidden">
          <View
            className="h-full rounded-full bg-lime-400"
            style={{ width: `${progresso}%` }}
          />
        </View>
      </View>

      <View className="bg-gray-800 rounded-3xl p-6 border border-white/10 mb-6">
        <View className="bg-gray-700 w-12 h-12 rounded-full items-center justify-center mb-4">
          <Ionicons name="sparkles" size={24} color="#a3e635" />
        </View>
        <Text className="text-xl font-bold text-white mb-2">
          Seu treino de hoje
        </Text>
        <Text className="text-gray-400 mb-6">
          Informe o tempo e os equipamentos que você tem agora e a IA monta o
          treino possível.
        </Text>
        <Pressable
          className="bg-lime-400 py-4 rounded-2xl items-center flex-row justify-center"
          onPress={() => router.push("/treino/geracao-ia")}
        >
          <Ionicons name="barbell" size={22} color="#111827" />
          <Text className="text-gray-900 font-bold text-base ml-2">
            Gerar treino com IA
          </Text>
        </Pressable>
      </View>

      <Text className="text-lg font-bold text-white mb-3">Último treino</Text>
      {ultimo ? (
        <Pressable
          className="flex-row items-center bg-gray-800 rounded-2xl p-4 border border-white/10"
          onPress={() =>
            router.push({ pathname: "/treino/[id]", params: { id: ultimo.id } })
          }
        >
          <View className="w-12 h-12 rounded-xl bg-gray-700 items-center justify-center mr-4">
            <Text className="text-white font-bold text-lg">
              {diaDoMes(ultimo.dataISO)}
            </Text>
            <Text className="text-gray-400 text-[10px]">
              {diaDaSemana(ultimo.dataISO)}
            </Text>
          </View>
          <View className="flex-1">
            <Text className="text-white font-semibold" numberOfLines={1}>
              {ultimo.titulo}
            </Text>
            <Text className="text-gray-400 text-xs mt-1">
              {ultimo.status} · {formatarDuracao(ultimo.duracaoSegundos)}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#6b7280" />
        </Pressable>
      ) : (
        <View className="bg-gray-800 rounded-2xl p-4 border border-white/10">
          <Text className="text-gray-400">
            Você ainda não concluiu nenhum treino. Que tal começar agora?
          </Text>
        </View>
      )}

      <View className="bg-gray-800 p-4 rounded-2xl border border-white/10 flex-row items-center mt-6">
        <Ionicons name="information-circle" size={24} color="#a3e635" />
        <Text className="text-gray-300 flex-1 ml-3">
          Consistência vale mais que carga. Faça o que é possível hoje!
        </Text>
      </View>
    </ScrollView>
  );
}
