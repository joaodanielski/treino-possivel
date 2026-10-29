import { useEffect, useMemo, useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { adicionarTreino } from "@/lib/storage";
import { formatarDuracao } from "@/lib/format";
import { lerExercicios, primeiro } from "@/lib/params";
import type { ExercicioRegistro, TreinoRegistro } from "@/lib/types";

export default function Execucao() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { titulo, exercicios: exerciciosParam } = useLocalSearchParams<{
    titulo?: string;
    exercicios?: string;
  }>();

  // Plano recebido por parâmetro (serializado pela tela de plano).
  const plano = useMemo(() => lerExercicios(exerciciosParam), [exerciciosParam]);
  const nomeTreino = primeiro(titulo) ?? "Treino";

  const [registro, setRegistro] = useState<ExercicioRegistro[]>(() =>
    (plano ?? []).map((ex) => ({
      id: ex.id,
      nome: ex.nome,
      repsAlvo: ex.reps,
      series: Array.from({ length: ex.series }, () => ({
        carga: "",
        reps: "",
        concluida: false,
      })),
    })),
  );
  const [segundos, setSegundos] = useState(0);
  const [pausado, setPausado] = useState(false);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (pausado) return;
    const intervalo = setInterval(() => setSegundos((s) => s + 1), 1000);
    return () => clearInterval(intervalo);
  }, [pausado]);

  const seriesTotais = registro.reduce((n, ex) => n + ex.series.length, 0);
  const seriesConcluidas = registro.reduce(
    (n, ex) => n + ex.series.filter((s) => s.concluida).length,
    0,
  );
  const progresso = seriesTotais
    ? Math.round((seriesConcluidas / seriesTotais) * 100)
    : 0;

  const atualizarSerie = (
    exId: string,
    indice: number,
    mudanca: Partial<ExercicioRegistro["series"][number]>,
  ) =>
    setRegistro((atual) =>
      atual.map((ex) =>
        ex.id !== exId
          ? ex
          : {
              ...ex,
              series: ex.series.map((s, i) => (i === indice ? { ...s, ...mudanca } : s)),
            },
      ),
    );

  const salvarEVoltar = async () => {
    if (salvando) return;
    setSalvando(true);
    const treino: TreinoRegistro = {
      id: Date.now().toString(),
      dataISO: new Date().toISOString(),
      titulo: nomeTreino,
      duracaoSegundos: segundos,
      seriesConcluidas,
      seriesTotais,
      status: seriesConcluidas === seriesTotais ? "Concluído" : "Parcial",
      exercicios: registro,
    };
    try {
      await adicionarTreino(treino);
      // Fecha a pilha (geração → plano → execução) e abre a aba Histórico.
      router.dismissAll();
      router.navigate("/(tabs)/historico");
    } catch {
      setSalvando(false);
      Alert.alert("Erro", "Não foi possível salvar o treino.");
    }
  };

  const finalizar = () => {
    if (seriesConcluidas === seriesTotais) {
      salvarEVoltar();
      return;
    }
    Alert.alert(
      "Atenção",
      `Você concluiu ${seriesConcluidas} de ${seriesTotais} séries. Deseja finalizar mesmo assim?`,
      [
        { text: "Continuar treinando", style: "cancel" },
        { text: "Finalizar", onPress: salvarEVoltar },
      ],
    );
  };

  const abandonar = () =>
    Alert.alert("Abandonar treino?", "O progresso desta sessão será perdido.", [
      { text: "Continuar", style: "cancel" },
      { text: "Abandonar", style: "destructive", onPress: () => router.back() },
    ]);

  if (!plano) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center p-6">
        <Ionicons name="alert-circle-outline" size={64} color="#f87171" />
        <Text className="text-lg font-bold text-white mt-4 text-center">
          Não foi possível abrir este treino.
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-6">
          Os dados do plano não foram recebidos. Gere um novo treino.
        </Text>
        <Pressable
          className="bg-lime-400 px-6 py-3 rounded-xl"
          onPress={() => router.back()}
        >
          <Text className="text-gray-900 font-bold">Voltar</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-900" style={{ paddingTop: Math.max(insets.top, 16) }}>
      <View className="px-5 pb-4 border-b border-white/10">
        <View className="flex-row items-center justify-between mb-4">
          <Pressable
            onPress={abandonar}
            accessibilityLabel="Abandonar treino"
            className="p-2 bg-gray-800 rounded-full"
          >
            <Ionicons name="close" size={22} color="#d1d5db" />
          </Pressable>
          <Text className="text-gray-400 text-xs font-semibold uppercase tracking-widest">
            Treino de hoje
          </Text>
          <View className="w-10" />
        </View>
        <View className="flex-row items-end justify-between">
          <View>
            <Text className="text-gray-400 text-sm mb-1">Tempo de treino</Text>
            <Text className="text-white text-4xl font-bold">
              {formatarDuracao(segundos)}
            </Text>
          </View>
          <Pressable
            onPress={() => setPausado((p) => !p)}
            className="flex-row items-center px-4 py-2 rounded-xl border border-white/10 bg-gray-800"
          >
            <Ionicons
              name={pausado ? "play" : "pause"}
              size={16}
              color="#a3e635"
            />
            <Text className="text-gray-50 font-medium ml-2">
              {pausado ? "Retomar" : "Pausar"}
            </Text>
          </Pressable>
        </View>
        <View className="mt-4 h-2 rounded-full bg-gray-700 overflow-hidden">
          <View
            className="h-full rounded-full bg-lime-400"
            style={{ width: `${progresso}%` }}
          />
        </View>
        <Text className="text-gray-400 text-xs mt-2">
          {seriesConcluidas}/{seriesTotais} séries concluídas
        </Text>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ padding: 20, gap: 16 }}
      >
        <Text className="text-xl font-bold text-white">{nomeTreino}</Text>
        {registro.map((ex, exIndice) => (
          <View
            key={ex.id}
            className="bg-gray-800 rounded-2xl border border-white/10 p-4"
          >
            <Text className="text-gray-400 text-xs mb-1">
              Exercício {exIndice + 1} de {registro.length}
            </Text>
            <Text className="text-white font-bold text-lg">{ex.nome}</Text>
            <Text className="text-gray-400 text-sm mb-3">
              Meta: {ex.repsAlvo} reps
            </Text>
            <View className="gap-2">
              {ex.series.map((serie, i) => (
                <View
                  key={i}
                  className={`flex-row items-center gap-2 rounded-xl border p-2 ${
                    serie.concluida
                      ? "border-green-500/30 bg-green-950"
                      : "border-white/10 bg-gray-900"
                  }`}
                >
                  <Text
                    className={`w-16 font-semibold text-sm ${
                      serie.concluida ? "text-green-400" : "text-gray-50"
                    }`}
                  >
                    Série {i + 1}
                  </Text>
                  <TextInput
                    className="flex-1 h-11 rounded-xl bg-gray-700 text-white text-center font-bold"
                    placeholder="kg"
                    placeholderTextColor="#6b7280"
                    keyboardType="decimal-pad"
                    value={serie.carga}
                    onChangeText={(v) => atualizarSerie(ex.id, i, { carga: v })}
                    accessibilityLabel={`Carga da série ${i + 1} em quilos`}
                  />
                  <TextInput
                    className="flex-1 h-11 rounded-xl bg-gray-700 text-white text-center font-bold"
                    placeholder="reps"
                    placeholderTextColor="#6b7280"
                    keyboardType="number-pad"
                    value={serie.reps}
                    onChangeText={(v) => atualizarSerie(ex.id, i, { reps: v })}
                    accessibilityLabel={`Repetições da série ${i + 1}`}
                  />
                  <Pressable
                    onPress={() =>
                      atualizarSerie(ex.id, i, { concluida: !serie.concluida })
                    }
                    accessibilityLabel={`${serie.concluida ? "Desmarcar" : "Marcar"} série ${i + 1} como concluída`}
                    className={`w-11 h-11 rounded-full border-2 items-center justify-center ${
                      serie.concluida
                        ? "bg-green-500 border-green-500"
                        : "border-gray-500"
                    }`}
                  >
                    {serie.concluida && (
                      <Ionicons name="checkmark" size={22} color="#111827" />
                    )}
                  </Pressable>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        className="border-t border-white/10 bg-gray-900 px-5 pt-4"
        style={{ paddingBottom: Math.max(insets.bottom, 16) }}
      >
        <Pressable
          className="bg-lime-400 h-14 rounded-2xl items-center flex-row justify-center"
          onPress={finalizar}
          disabled={salvando}
        >
          <Text className="text-gray-900 font-bold text-base mr-2">
            Finalizar treino
          </Text>
          <Ionicons name="checkmark" size={20} color="#111827" />
        </Pressable>
      </View>
    </View>
  );
}
