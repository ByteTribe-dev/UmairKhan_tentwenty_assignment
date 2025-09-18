import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../components/Text";
import { Colors } from "../../constants/theme";

export default function MediaLibraryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text variant="bold" size="xxl" color={Colors.primary}>
          Media Library
        </Text>
        <Text
          variant="regular"
          size="md"
          color={Colors.textSecondary}
          style={styles.description}
        >
          Media library functionality will be implemented here.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  description: {
    marginTop: 16,
    textAlign: "center",
  },
});
