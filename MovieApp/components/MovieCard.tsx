import React from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../constants/theme";
import { Movie, api } from "../services/api";
import { Text } from "./Text";

interface MovieCardProps {
  movie: Movie;
  onPress: () => void;
}

const { width } = Dimensions.get("window");
const cardWidth = width - 32;

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image
        source={{
          uri: api.getImageUrl(movie.backdrop_path || movie.poster_path),
        }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text
          variant="bold"
          size="xl"
          color={Colors.white}
          style={styles.title}
        >
          {movie.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: cardWidth,
    height: 200,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 16,
  },
  title: {
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
