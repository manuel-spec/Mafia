import { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Accent = ({ children }: { children: ReactNode }) => (
  <Text style={styles.accent}>{children}</Text>
);

type RoleSetupProps = {
  playerCount: string;
  mafiaCount: string;
  maxMafia: number;
  error?: string | null;
  onPlayerCountChange: (text: string) => void;
  onMafiaCountChange: (text: string) => void;
  onAssign: () => void;
};

export function RoleSetup({
  playerCount,
  mafiaCount,
  maxMafia,
  error,
  onPlayerCountChange,
  onMafiaCountChange,
  onAssign,
}: RoleSetupProps) {
  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={32}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Mafia Role Assigner</Text>
        <Text style={styles.subtitle}>
          Pass the phone, let each player see their secret alignment.
        </Text>

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Setup</Text>
            <Text style={styles.cardHint}>
              Only two roles: Mafia & Civilian
            </Text>
          </View>

          <View style={styles.row}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Players</Text>
              <TextInput
                value={playerCount}
                onChangeText={onPlayerCountChange}
                keyboardType="number-pad"
                inputMode="numeric"
                style={styles.input}
                placeholder="e.g. 8"
                placeholderTextColor="#666"
              />
            </View>
            <View style={styles.inputGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>Mafia</Text>
                <Text style={styles.helper}>(0 - {maxMafia})</Text>
              </View>
              <TextInput
                value={mafiaCount}
                onChangeText={onMafiaCountChange}
                keyboardType="number-pad"
                inputMode="numeric"
                style={styles.input}
                placeholder="e.g. 2"
                placeholderTextColor="#666"
              />
            </View>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable style={styles.primaryButton} onPress={onAssign}>
            <Text style={styles.primaryText}>Shuffle & start</Text>
          </Pressable>
        </View>

        <View style={styles.tip}>
          <Text style={styles.tipText}>
            After shuffling, hand the phone to <Accent>Player 1</Accent> and tap
            <Accent> Reveal</Accent>. Hide it before passing to the next player.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 24,
    gap: 18,
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  subtitle: {
    color: "#cfd3d8",
    fontSize: 16,
    lineHeight: 22,
  },
  card: {
    backgroundColor: "#0f0f10",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#1f1f22",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 8,
    gap: 14,
  },
  cardHeader: {
    gap: 6,
  },
  cardTitle: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "700",
  },
  cardHint: {
    color: "#7f8590",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  inputGroup: {
    flex: 1,
  },
  label: {
    color: "#cfd3d8",
    marginBottom: 6,
    fontWeight: "600",
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 6,
  },
  helper: {
    color: "#7f8590",
    fontSize: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#242428",
    backgroundColor: "#15161a",
    color: "#f5f6f7",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  primaryButton: {
    backgroundColor: "#e53935",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  primaryText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
    textTransform: "uppercase",
  },
  error: {
    color: "#ffb3b3",
    fontSize: 14,
  },
  tip: {
    backgroundColor: "#0d0e12",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#1a1b1f",
  },
  tipText: {
    color: "#b6bcc6",
    fontSize: 15,
    lineHeight: 21,
  },
  accent: {
    color: "#e53935",
    fontWeight: "700",
  },
});
