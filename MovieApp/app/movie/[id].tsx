/**
 * Movie Detail Screen
 * Displays detailed movie information, trailer, and booking options
 */

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { VideoPlayer } from "../../components/VideoPlayer";
import { Colors } from "../../constants/theme";
import { MovieDetails, Video, api } from "../../services/api";

const { height } = Dimensions.get("window");

export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams();

  // State management
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  /**
   * Load movie details and videos
   */
  const loadMovieDetails = useCallback(async () => {
    try {
      const movieId = parseInt(id as string);
      const [movieData, videoData] = await Promise.all([
        api.getMovieDetails(movieId),
        api.getMovieVideos(movieId),
      ]);

      setMovie(movieData);
      setVideos(videoData);
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Handle watch trailer button press
   */
  const handleWatchTrailer = () => {
    const trailer = videos.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );

    if (trailer) {
      setShowVideoPlayer(true);
    }
  };

  /**
   * Handle get tickets button press
   */
  const handleGetTickets = () => {
    router.push(`/booking/${id}`);
  };

  /**
   * Close video player
   */
  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
  };

  /**
   * Render genre chip
   */
  const renderGenreChip = (genre: { id: number; name: string }) => (
    <View
      key={genre.id}
      style={[styles.genreChip, { backgroundColor: getGenreColor(genre.name) }]}
    >
      <Text variant="medium" size="sm" color={Colors.white}>
        {genre.name}
      </Text>
    </View>
  );

  /**
   * Get color for genre chip based on genre name
   */
  const getGenreColor = (genreName: string) => {
    const colors = [Colors.success, Colors.pink, Colors.purple, Colors.yellow];
    const index = genreName.length % colors.length;
    return colors[index];
  };

  // Load data on component mount
  useEffect(() => {
    if (id) {
      loadMovieDetails();
    }
  }, [id, loadMovieDetails]);

  // Loading state
  if (loading || !movie) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text variant="medium" size="lg" color={Colors.primary}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Find YouTube trailer
  const trailer = videos.find(
    (video) => video.type === "Trailer" && video.site === "YouTube"
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Video Player Modal */}
      {trailer && (
        <VideoPlayer
          visible={showVideoPlayer}
          videoKey={trailer.key}
          onClose={handleCloseVideoPlayer}
        />
      )}

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={{
              uri: api.getImageUrl(movie.backdrop_path || movie.poster_path),
            }}
            style={styles.backdropImage}
            resizeMode="cover"
          />

          {/* Back Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>

          {/* Movie Info Overlay */}
          <View style={styles.movieInfo}>
            <Text
              variant="bold"
              size="xxxl"
              color={Colors.white}
              style={styles.title}
            >
              {movie.title}
            </Text>

            <Text
              variant="regular"
              size="md"
              color={Colors.white}
              style={styles.releaseDate}
            >
              In Theaters{" "}
              {new Date(movie.release_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                title="Get Tickets"
                onPress={handleGetTickets}
                variant="primary"
                size="large"
                style={styles.getTicketsButton}
              />

              {trailer && (
                <Button
                  title="▶ Watch Trailer"
                  onPress={handleWatchTrailer}
                  variant="outline"
                  size="large"
                  style={styles.trailerButton}
                />
              )}
            </View>
          </View>
        </View>

        {/* Content Section */}
        <View style={styles.contentContainer}>
          {/* Genres */}
          <View style={styles.section}>
            <Text
              variant="medium"
              size="lg"
              color={Colors.primary}
              style={styles.sectionTitle}
            >
              Genres
            </Text>
            <View style={styles.genresContainer}>
              {movie.genres.map(renderGenreChip)}
            </View>
          </View>

          {/* Overview */}
          <View style={styles.section}>
            <Text
              variant="medium"
              size="lg"
              color={Colors.primary}
              style={styles.sectionTitle}
            >
              Overview
            </Text>
            <Text
              variant="regular"
              size="md"
              color={Colors.textSecondary}
              style={styles.overview}
            >
              {movie.overview}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.6,
    position: "relative",
  },
  backdropImage: {
    width: "100%",
    height: "100%",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 8,
  },
  movieInfo: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 20,
  },
  title: {
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  releaseDate: {
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    gap: 12,
  },
  getTicketsButton: {
    width: "90%",
    alignSelf: "center",
  },
  trailerButton: {
    width: "90%",
    alignSelf: "center",
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  genresContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  genreChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  overview: {
    lineHeight: 24,
  },
});
