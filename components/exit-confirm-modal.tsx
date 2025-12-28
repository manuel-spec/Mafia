import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "@/stores/theme-store";

export type ExitConfirmModalProps = {
  visible: boolean;
  onStay: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
};

export function ExitConfirmModal({
  visible,
  onStay,
  onConfirm,
  title = "Exit the game?",
  message = "This will clear the current game and return to setup.",
}: ExitConfirmModalProps) {
  const { colors } = useTheme();

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onStay}
    >
      <View style={styles.modalBackdrop}>
        <View
          style={[
            styles.modalCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.cardBorder,
              shadowColor: colors.shadow,
            },
          ]}
        >
          <View style={styles.modalHeader}>
            <Ionicons name="alert-circle" size={28} color={colors.warning} />
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              {title}
            </Text>
          </View>
          <Text style={[styles.modalBody, { color: colors.muted }]}>
            {message}
          </Text>
          <View style={styles.modalActions}>
            <Pressable
              onPress={onStay}
              style={[
                styles.secondaryButton,
                { borderColor: colors.cardBorder },
              ]}
            >
              <Text style={[styles.secondaryText, { color: colors.text }]}>
                Stay
              </Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              style={[
                styles.primaryButton,
                {
                  backgroundColor: colors.primary,
                  shadowColor: colors.primary,
                },
              ]}
            >
              <Text style={[styles.primaryText, { color: colors.primaryText }]}>
                Exit & reset
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  modalCard: {
    width: "100%",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    gap: 12,
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
  },
  modalBody: {
    fontSize: 15,
    lineHeight: 21,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 4,
  },
  primaryButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
  },
  primaryText: {
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.3,
  },
  secondaryButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  secondaryText: {
    fontWeight: "800",
    fontSize: 14,
    letterSpacing: 0.3,
  },
});
