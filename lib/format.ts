const DIAS = ["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"];

export function formatarDuracao(totalSegundos: number): string {
  const h = Math.floor(totalSegundos / 3600);
  const m = Math.floor((totalSegundos % 3600) / 60);
  const s = totalSegundos % 60;
  const mm = String(m).padStart(2, "0");
  const ss = String(s).padStart(2, "0");
  return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
}

export function formatarData(dataISO: string): string {
  return new Date(dataISO).toLocaleDateString("pt-BR");
}

export function diaDoMes(dataISO: string): string {
  return String(new Date(dataISO).getDate()).padStart(2, "0");
}

export function diaDaSemana(dataISO: string): string {
  return DIAS[new Date(dataISO).getDay()];
}
