import { Ionicons } from "@expo/vector-icons";
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

const { width } = Dimensions.get("window");

interface SearchResultCardProps {
  movie: Movie;
}

export function SearchResultCard({ movie }: SearchResultCardProps) {
  // Get the first genre name for display
  const getGenreName = () => {
    // This is a simplified approach - in a real app you'd map genre_ids to genre names
    // For now, we'll use a simple mapping or show "Movie" as default
    const genreMap: { [key: number]: string } = {
      28: "Action",
      12: "Adventure",
      16: "Animation",
      35: "Comedy",
      80: "Crime",
      99: "Documentary",
      18: "Drama",
      10751: "Family",
      14: "Fantasy",
      36: "History",
      27: "Horror",
      10402: "Music",
      9648: "Mystery",
      10749: "Romance",
      878: "Sci-Fi",
      10770: "TV Movie",
      53: "Thriller",
      10752: "War",
      37: "Western",
    };

    const firstGenreId = movie.genre_ids?.[0];
    return firstGenreId ? genreMap[firstGenreId] || "Movie" : "Movie";
  };

  return (
    <TouchableOpacity style={styles.container}>
      {/* Movie Poster */}
      <View style={styles.posterContainer}>
        <Image
          source={{ uri: api.getImageUrl(movie.poster_path) }}
          style={styles.poster}
          resizeMode="cover"
        />
      </View>

      {/* Movie Info */}
      <View style={styles.infoContainer}>
        <Text
          variant="medium"
          size="lg"
          color={Colors.primary}
          numberOfLines={1}
          style={styles.title}
        >
          {movie.title}
        </Text>
        <Text
          variant="regular"
          size="sm"
          color={Colors.textSecondary}
          numberOfLines={1}
          style={styles.genre}
        >
          {getGenreName()}
        </Text>
      </View>

      {/* Three Dots Menu */}
      <TouchableOpacity style={styles.menuButton}>
        <Ionicons name="ellipsis-horizontal" size={20} color={Colors.accent} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background,
    marginHorizontal: 20,
    marginVertical: 8,
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  posterContainer: {
    width: 130,
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 16,
  },
  poster: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  title: {
    marginBottom: 4,
  },
  genre: {
    // Genre text styling
  },
  menuButton: {
    padding: 8,
    marginLeft: 8,
  },
});
