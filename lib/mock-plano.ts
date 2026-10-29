import type { Exercicio, Objetivo, Plano } from "./types";

// ATENÇÃO: geração SIMULADA. Na entrega 3 este módulo é substituído pela chamada
// à LLM (Gemini). A assinatura das funções foi pensada para essa troca.

type Modelo = { nome: string; reps: string };

const BANCO: Record<string, Modelo[]> = {
  "Peso corporal": [
    { nome: "Flexão de braços", reps: "10-15" },
    { nome: "Agachamento livre", reps: "15-20" },
    { nome: "Afundo alternado", reps: "12 por perna" },
    { nome: "Prancha abdominal", reps: "30-45s" },
    { nome: "Ponte de glúteos", reps: "15-20" },
    { nome: "Mergulho no banco", reps: "10-12" },
  ],
  Halteres: [
    { nome: "Supino com halteres", reps: "8-12" },
    { nome: "Remada curvada com halteres", reps: "10-12" },
    { nome: "Desenvolvimento com halteres", reps: "10-12" },
    { nome: "Agachamento goblet", reps: "12-15" },
    { nome: "Rosca direta com halteres", reps: "10-12" },
    { nome: "Tríceps francês", reps: "10-12" },
  ],
  Barra: [
    { nome: "Supino reto com barra", reps: "8-10" },
    { nome: "Agachamento com barra", reps: "8-10" },
    { nome: "Remada curvada com barra", reps: "8-10" },
    { nome: "Levantamento terra romeno", reps: "10-12" },
    { nome: "Desenvolvimento militar", reps: "8-10" },
  ],
  "Academia Completa": [
    { nome: "Leg press", reps: "10-12" },
    { nome: "Puxada frontal", reps: "10-12" },
    { nome: "Supino na máquina", reps: "10-12" },
    { nome: "Cadeira extensora", reps: "12-15" },
    { nome: "Mesa flexora", reps: "12-15" },
    { nome: "Remada baixa", reps: "10-12" },
  ],
};

function modelosDisponiveis(equipamentos: string[]): Modelo[] {
  const escolhidos = equipamentos.filter((e) => BANCO[e]);
  const fontes = escolhidos.length > 0 ? escolhidos : ["Peso corporal"];
  // Intercala os equipamentos para variar os grupos musculares.
  const listas = fontes.map((e) => BANCO[e]);
  const maior = Math.max(...listas.map((l) => l.length));
  const resultado: Modelo[] = [];
  for (let i = 0; i < maior; i++) {
    for (const lista of listas) if (lista[i]) resultado.push(lista[i]);
  }
  return resultado;
}

export function gerarPlanoMock(entrada: {
  minutos: number;
  equipamentos: string[];
  objetivo: Objetivo;
}): Plano {
  const qtd = Math.min(8, Math.max(3, Math.round(entrada.minutos / 10)));
  const series = entrada.objetivo === "Hipertrofia" ? 4 : 3;
  const exercicios: Exercicio[] = modelosDisponiveis(entrada.equipamentos)
    .slice(0, qtd)
    .map((m, i) => ({ id: String(i + 1), nome: m.nome, series, reps: m.reps }));

  return {
    titulo: `Treino ${entrada.objetivo} · ${entrada.minutos} min`,
    descricao: `Adaptado para ${entrada.equipamentos.join(", ") || "peso corporal"}.`,
    exercicios,
  };
}

// Devolve uma alternativa que ainda não está no plano, respeitando os equipamentos.
export function substituirExercicioMock(
  atual: Exercicio,
  equipamentos: string[],
  nomesNoPlano: string[],
): Exercicio | null {
  const alternativa = modelosDisponiveis(equipamentos).find(
    (m) => !nomesNoPlano.includes(m.nome),
  );
  if (!alternativa) return null;
  return { ...atual, nome: alternativa.nome, reps: alternativa.reps };
}
