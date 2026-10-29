import type { Exercicio } from "./types";

// useLocalSearchParams devolve string | string[] | undefined.
export function primeiro(valor?: string | string[]): string | undefined {
  return Array.isArray(valor) ? valor[0] : valor;
}

// Params de rota são sempre texto; o plano viaja serializado e é validado aqui
// para que a tela de execução não quebre com dados inválidos (ex.: link manual).
export function lerExercicios(valor?: string | string[]): Exercicio[] | null {
  const texto = primeiro(valor);
  if (!texto) return null;
  try {
    const dados: unknown = JSON.parse(texto);
    if (!Array.isArray(dados) || dados.length === 0) return null;
    const valido = dados.every(
      (e) =>
        e &&
        typeof e.id === "string" &&
        typeof e.nome === "string" &&
        typeof e.series === "number" &&
        e.series > 0 &&
        typeof e.reps === "string",
    );
    return valido ? (dados as Exercicio[]) : null;
  } catch {
    return null;
  }
}
