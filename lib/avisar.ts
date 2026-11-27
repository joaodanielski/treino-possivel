import { Alert, Platform } from "react-native";

type Botao = {
  text: string;
  style?: "cancel" | "destructive" | "default";
  onPress?: () => void;
};

/**
 * Substitui Alert.alert de forma compatível com a web.
 * No react-native-web o Alert.alert não faz nada, então usamos
 * window.alert / window.confirm quando rodando no navegador.
 */
export function avisar(titulo: string, mensagem?: string, botoes?: Botao[]) {
  if (Platform.OS !== "web") {
    Alert.alert(titulo, mensagem, botoes);
    return;
  }

  const texto = mensagem ? `${titulo}\n\n${mensagem}` : titulo;

  // Aviso simples (zero ou um botão): só informa e executa o callback, se houver.
  if (!botoes || botoes.length < 2) {
    window.alert(texto);
    botoes?.[0]?.onPress?.();
    return;
  }

  // Confirmação (dois ou mais botões): OK dispara a ação, Cancelar dispara o botão "cancel".
  const cancelar = botoes.find((b) => b.style === "cancel");
  const confirmar = botoes.find((b) => b.style !== "cancel");
  if (window.confirm(texto)) confirmar?.onPress?.();
  else cancelar?.onPress?.();
}
