import { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Chip } from "@/components/Chip";
import { carregarPerfil, PERFIL_PADRAO, salvarPerfil } from "@/lib/storage";
import { EQUIPAMENTOS, OBJETIVOS, type Perfil as PerfilTipo } from "@/lib/types";

const TEMPO_MIN = 15;
const TEMPO_MAX = 120;

export default function Perfil() {
  const insets = useSafeAreaInsets();
  const [perfil, setPerfil] = useState<PerfilTipo>(PERFIL_PADRAO);
  const [carregando, setCarregando] = useState(true);

  useFocusEffect(
    useCallback(() => {
      (async () => {
        try {
          setPerfil(await carregarPerfil());
        } catch {
          Alert.alert("Erro", "Não foi possível carregar os dados offline.");
        } finally {
          setCarregando(false);
        }
      })();
    }, []),
  );

  const alterar = <K extends keyof PerfilTipo>(campo: K, valor: PerfilTipo[K]) =>
    setPerfil((atual) => ({ ...atual, [campo]: valor }));

  const alternarEquipamento = (item: string) =>
    alterar(
      "equipamentos",
      perfil.equipamentos.includes(item)
        ? perfil.equipamentos.filter((e) => e !== item)
        : [...perfil.equipamentos, item],
    );

  const ajustarTempo = (delta: number) =>
    alterar(
      "minutosPorDia",
      Math.min(TEMPO_MAX, Math.max(TEMPO_MIN, perfil.minutosPorDia + delta)),
    );

  const salvar = async () => {
    if (!perfil.nome.trim()) {
      Alert.alert("Nome obrigatório", "Informe seu nome ou apelido.");
      return;
    }
    if (perfil.equipamentos.length === 0) {
      Alert.alert("Equipamentos", "Selecione ao menos um equipamento.");
      return;
    }
    try {
      await salvarPerfil({ ...perfil, nome: perfil.nome.trim() });
      Alert.alert("Pronto!", "Seu perfil foi salvo no dispositivo.");
    } catch {
      Alert.alert("Erro", "Não foi possível salvar os dados.");
    }
  };

  if (carregando) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <ActivityIndicator size="large" color="#a3e635" />
        <Text className="text-gray-400 mt-4">Carregando seu perfil...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-900"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 24,
        paddingBottom: 40,
      }}
    >
      <Text className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Vamos começar
      </Text>
      <Text className="text-3xl font-bold text-white mt-1 mb-6">Seu perfil</Text>

      <Text className="text-white font-semibold mb-2">Nome ou apelido</Text>
      <TextInput
        className="h-14 rounded-2xl border border-white/10 bg-gray-800 px-4 text-white text-base mb-6"
        placeholder="Ex: João Victor"
        placeholderTextColor="#6b7280"
        value={perfil.nome}
        onChangeText={(v) => alterar("nome", v)}
      />

      <Text className="text-white font-semibold mb-2">Objetivo</Text>
      <View className="flex-row flex-wrap gap-2 mb-6">
        {OBJETIVOS.map((o) => (
          <Chip
            key={o}
            rotulo={o}
            ativo={perfil.objetivo === o}
            onPress={() => alterar("objetivo", o)}
          />
        ))}
      </View>

      <Text className="text-white font-semibold mb-2">
        Dias disponíveis na semana
      </Text>
      <View className="flex-row gap-2 bg-gray-800 rounded-2xl border border-white/10 p-2">
        {[1, 2, 3, 4, 5, 6, 7].map((dia) => (
          <Pressable
            key={dia}
            onPress={() => alterar("diasPorSemana", dia)}
            accessibilityLabel={`${dia} ${dia === 1 ? "dia" : "dias"} por semana`}
            className={`flex-1 aspect-square items-center justify-center rounded-xl ${
              perfil.diasPorSemana === dia ? "bg-lime-400" : ""
            }`}
          >
            <Text
              className={`font-semibold ${
                perfil.diasPorSemana === dia ? "text-gray-900" : "text-gray-400"
              }`}
            >
              {dia}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text className="text-gray-400 text-xs mt-2 mb-6">
        Você treinará {perfil.diasPorSemana}{" "}
        {perfil.diasPorSemana === 1 ? "dia" : "dias"} por semana.
      </Text>

      <Text className="text-white font-semibold mb-2">
        Tempo diário disponível
      </Text>
      <View className="flex-row items-center justify-between bg-gray-800 rounded-2xl border border-white/10 p-2 mb-6">
        <Pressable
          onPress={() => ajustarTempo(-5)}
          accessibilityLabel="Diminuir 5 minutos"
          className="w-12 h-12 rounded-xl bg-gray-700 items-center justify-center"
        >
          <Ionicons name="remove" size={22} color="#f9fafb" />
        </Pressable>
        <Text className="text-lime-400 font-bold text-xl">
          {perfil.minutosPorDia} min
        </Text>
        <Pressable
          onPress={() => ajustarTempo(5)}
          accessibilityLabel="Aumentar 5 minutos"
          className="w-12 h-12 rounded-xl bg-gray-700 items-center justify-center"
        >
          <Ionicons name="add" size={22} color="#f9fafb" />
        </Pressable>
      </View>

      <Text className="text-white font-semibold mb-2">
        Equipamentos disponíveis
      </Text>
      <View className="flex-row flex-wrap gap-2 mb-8">
        {EQUIPAMENTOS.map((e) => (
          <Chip
            key={e}
            rotulo={e}
            ativo={perfil.equipamentos.includes(e)}
            onPress={() => alternarEquipamento(e)}
          />
        ))}
      </View>

      <Pressable
        className="bg-lime-400 h-14 rounded-2xl items-center justify-center"
        onPress={salvar}
      >
        <Text className="text-gray-900 font-bold text-base">Salvar perfil</Text>
      </Pressable>
    </ScrollView>
  );
}
