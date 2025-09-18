import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";
import { Text } from "./Text";

const { width } = Dimensions.get("window");
const cardWidth = (width - 48) / 2; // Account for padding and gap

interface CategoryCardProps {
  title: string;
  imageUrl?: string;
  onPress: () => void;
}

export function CategoryCard({ title, imageUrl, onPress }: CategoryCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.image, styles.placeholderImage]} />
      )}
      <View style={styles.overlay}>
        <Text
          variant="bold"
          size="md"
          color={Colors.white}
          numberOfLines={2}
          style={styles.title}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 120,
    margin: 8,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    backgroundColor: Colors.textSecondary,
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 12,
  },
  title: {
    textAlign: "center",
  },
});
