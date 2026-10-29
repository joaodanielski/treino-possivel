import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Perfil, TreinoRegistro } from "./types";

// Chaves versionadas: a estrutura mudou em relação à primeira versão do app.
const CHAVE_PERFIL = "@treino_possivel/perfil_v2";
const CHAVE_HISTORICO = "@treino_possivel/historico_v2";

export const PERFIL_PADRAO: Perfil = {
  nome: "",
  objetivo: "Hipertrofia",
  diasPorSemana: 3,
  minutosPorDia: 45,
  equipamentos: ["Peso corporal"],
};

export async function carregarPerfil(): Promise<Perfil> {
  const bruto = await AsyncStorage.getItem(CHAVE_PERFIL);
  if (!bruto) return PERFIL_PADRAO;
  return { ...PERFIL_PADRAO, ...(JSON.parse(bruto) as Partial<Perfil>) };
}

export async function salvarPerfil(perfil: Perfil): Promise<void> {
  await AsyncStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
}

// Lança erro se o JSON estiver corrompido: as telas tratam isso como estado de erro.
export async function carregarHistorico(): Promise<TreinoRegistro[]> {
  const bruto = await AsyncStorage.getItem(CHAVE_HISTORICO);
  if (!bruto) return [];
  const dados = JSON.parse(bruto);
  if (!Array.isArray(dados)) throw new Error("Histórico em formato inválido");
  return dados as TreinoRegistro[];
}

export async function adicionarTreino(treino: TreinoRegistro): Promise<void> {
  const historico = await carregarHistorico();
  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify([treino, ...historico]),
  );
}

export async function buscarTreino(
  id: string,
): Promise<TreinoRegistro | undefined> {
  const historico = await carregarHistorico();
  return historico.find((t) => t.id === id);
}

export async function removerTreino(id: string): Promise<void> {
  const historico = await carregarHistorico();
  await AsyncStorage.setItem(
    CHAVE_HISTORICO,
    JSON.stringify(historico.filter((t) => t.id !== id)),
  );
}
