import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/Chip";
import { carregarPerfil, PERFIL_PADRAO } from "@/lib/storage";
import { EQUIPAMENTOS, type Perfil } from "@/lib/types";

export default function GeracaoIA() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [perfil, setPerfil] = useState<Perfil>(PERFIL_PADRAO);
  const [tempo, setTempo] = useState(String(PERFIL_PADRAO.minutosPorDia));
  const [equipamentos, setEquipamentos] = useState<string[]>(
    PERFIL_PADRAO.equipamentos,
  );
  const [gerando, setGerando] = useState(false);
  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pré-preenche com o perfil salvo; o usuário pode ajustar só para o treino de hoje.
  useEffect(() => {
    carregarPerfil()
      .then((p) => {
        setPerfil(p);
        setTempo(String(p.minutosPorDia));
        setEquipamentos(p.equipamentos);
      })
      .catch(() => {});
    return () => {
      if (temporizador.current) clearTimeout(temporizador.current);
    };
  }, []);

  const alternar = (item: string) =>
    setEquipamentos((atual) =>
      atual.includes(item) ? atual.filter((e) => e !== item) : [...atual, item],
    );

  const gerar = () => {
    const minutos = Number(tempo);
    if (!Number.isFinite(minutos) || minutos < 10 || minutos > 180) {
      Alert.alert("Tempo inválido", "Informe um tempo entre 10 e 180 minutos.");
      return;
    }
    if (equipamentos.length === 0) {
      Alert.alert("Equipamentos", "Selecione ao menos um equipamento.");
      return;
    }
    setGerando(true);
    // Simula a latência da LLM. Na entrega 3 aqui entra a chamada à API.
    temporizador.current = setTimeout(() => {
      setGerando(false);
      // Parâmetros viajam como texto; a tela de plano interpreta e gera o treino.
      router.push({
        pathname: "/treino/plano",
        params: {
          tempo: String(minutos),
          equipamentos: equipamentos.join(","),
          objetivo: perfil.objetivo,
        },
      });
    }, 1800);
  };

  if (gerando) {
    return (
      <View className="flex-1 bg-gray-900 justify-center items-center px-6">
        <ActivityIndicator size="large" color="#a3e635" />
        <Text className="text-xl font-bold text-white mt-6 text-center">
          A IA está montando seu treino...
        </Text>
        <Text className="text-gray-400 mt-4 text-center">
          Cruzando seu objetivo com o tempo e os equipamentos de hoje.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        padding: 24,
        paddingTop: Math.max(insets.top, 16) + 8,
      }}
    >
      <View className="flex-row justify-between items-center mb-8">
        <Text className="text-3xl font-bold text-white">Novo treino</Text>
        <Pressable
          onPress={() => router.back()}
          accessibilityLabel="Fechar"
          className="p-2 bg-gray-800 rounded-full"
        >
          <Ionicons name="close" size={24} color="#d1d5db" />
        </Pressable>
      </View>

      <Text className="text-white font-semibold mb-2">
        Tempo disponível hoje (minutos)
      </Text>
      <TextInput
        className="h-14 rounded-2xl border border-white/10 bg-gray-800 px-4 text-white text-base mb-6"
        keyboardType="numeric"
        value={tempo}
        onChangeText={setTempo}
        placeholderTextColor="#6b7280"
      />

      <Text className="text-white font-semibold mb-2">O que você tem hoje?</Text>
      <View className="flex-row flex-wrap gap-2 mb-8">
        {EQUIPAMENTOS.map((e) => (
          <Chip
            key={e}
            rotulo={e}
            ativo={equipamentos.includes(e)}
            onPress={() => alternar(e)}
          />
        ))}
      </View>

      <View className="bg-gray-800 p-4 rounded-2xl border border-white/10 mb-8">
        <View className="flex-row items-center mb-2">
          <Ionicons name="hardware-chip-outline" size={20} color="#a3e635" />
          <Text className="text-white font-bold ml-2">Como funciona?</Text>
        </View>
        <Text className="text-gray-400 text-sm leading-5">
          O treino é ajustado ao tempo e ao maquinário que você escolheu acima.
          Você poderá revisar o plano e pedir a troca de exercícios antes de
          começar.
        </Text>
      </View>

      <Pressable
        className="bg-lime-400 h-14 rounded-2xl items-center flex-row justify-center"
        onPress={gerar}
      >
        <Ionicons name="color-wand-outline" size={22} color="#111827" />
        <Text className="text-gray-900 font-bold text-base ml-2">
          Gerar treino
        </Text>
      </Pressable>
    </ScrollView>
  );
}
