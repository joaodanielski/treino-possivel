export const OBJETIVOS = ["Hipertrofia", "Emagrecimento", "Manutenção"] as const;
export type Objetivo = (typeof OBJETIVOS)[number];

export const EQUIPAMENTOS = [
  "Peso corporal",
  "Halteres",
  "Barra",
  "Academia Completa",
] as const;

export type Perfil = {
  nome: string;
  objetivo: Objetivo;
  diasPorSemana: number;
  minutosPorDia: number;
  equipamentos: string[];
};

export type Exercicio = {
  id: string;
  nome: string;
  series: number;
  reps: string;
};

export type Plano = {
  titulo: string;
  descricao: string;
  exercicios: Exercicio[];
};

export type SerieRegistro = {
  carga: string;
  reps: string;
  concluida: boolean;
};

export type ExercicioRegistro = {
  id: string;
  nome: string;
  repsAlvo: string;
  series: SerieRegistro[];
};

export type TreinoRegistro = {
  id: string;
  dataISO: string;
  titulo: string;
  duracaoSegundos: number;
  seriesConcluidas: number;
  seriesTotais: number;
  status: "Concluído" | "Parcial";
  exercicios: ExercicioRegistro[];
};
