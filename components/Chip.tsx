import { Pressable, Text } from "react-native";

type Props = {
  rotulo: string;
  ativo: boolean;
  onPress: () => void;
};

export function Chip({ rotulo, ativo, onPress }: Props) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: ativo }}
      className={`px-4 py-3 rounded-2xl border ${
        ativo ? "bg-gray-700 border-lime-400/60" : "bg-gray-800 border-white/10"
      }`}
    >
      <Text
        className={`text-sm font-medium ${ativo ? "text-gray-50" : "text-gray-400"}`}
      >
        {rotulo}
      </Text>
    </Pressable>
  );
}
