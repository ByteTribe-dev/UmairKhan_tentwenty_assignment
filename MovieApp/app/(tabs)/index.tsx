import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CategoryCard } from "../../components/CategoryCard";
import { MovieCard } from "../../components/MovieCard";
import { SearchHeader } from "../../components/SearchHeader";
import { SearchResultCard } from "../../components/SearchResultCard";
import { Colors } from "../../constants/theme";
import { Movie, api } from "../../services/api";

interface CategoryWithImage {
  id: number;
  title: string;
  imageUrl?: string;
}

export default function WatchScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [categories, setCategories] = useState<CategoryWithImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [selectedGenre, setSelectedGenre] = useState<CategoryWithImage | null>(
    null
  );
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);

  const loadUpcomingMovies = async () => {
    const upcomingMovies = await api.getUpcomingMovies();
    setMovies(upcomingMovies);
  };

  const loadCategories = async () => {
    try {
      const genres = await api.getGenres();
      // Get the first 10 genres for display
      const selectedGenres = genres.slice(0, 10);

      // For each genre, get a representative movie to use as background image
      const categoriesWithImages = await Promise.all(
        selectedGenres.map(async (genre) => {
          const movies = await api.getMoviesByGenre(genre.id);
          const representativeMovie =
            movies.find((movie) => movie.backdrop_path) || movies[0];

          return {
            id: genre.id,
            title: genre.name,
            imageUrl: representativeMovie?.backdrop_path
              ? api.getImageUrl(representativeMovie.backdrop_path)
              : undefined,
          };
        })
      );

      setCategories(categoriesWithImages);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const searchMovies = useCallback(async () => {
    if (searchQuery.trim().length > 0) {
      const results = await api.searchMovies(searchQuery);
      setSearchResults(results);
      setShowSearchResults(true);
      setIsTyping(false);
    }
  }, [searchQuery]);

  const handleGenreSelection = async (genre: CategoryWithImage) => {
    try {
      setSelectedGenre(genre);
      const movies = await api.getMoviesByGenre(genre.id);
      setGenreMovies(movies);
    } catch (error) {
      console.error("Error loading genre movies:", error);
    }
  };

  useEffect(() => {
    loadUpcomingMovies();
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery.length > 0) {
      setIsTyping(true);
      setShowSearchResults(false);

      // Debounce search - wait 500ms after user stops typing
      const timeoutId = setTimeout(() => {
        searchMovies();
      }, 500);

      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
      setShowSearchResults(false);
      setIsTyping(false);
    }
  }, [searchQuery, searchMovies]);

  const handleSearchPress = () => {
    setIsSearching(true);
  };

  const handleCloseSearch = () => {
    setIsSearching(false);
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    setIsTyping(false);
    setSelectedGenre(null);
    setGenreMovies([]);
  };

  const handleBackFromGenre = () => {
    setSelectedGenre(null);
    setGenreMovies([]);
  };

  const handleMoviePress = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const renderMovieCard = ({ item }: { item: Movie }) => (
    <MovieCard movie={item} onPress={() => handleMoviePress(item.id)} />
  );

  const renderCategoryCard = ({ item }: { item: CategoryWithImage }) => (
    <CategoryCard
      title={item.title}
      imageUrl={item.imageUrl}
      onPress={() => handleGenreSelection(item)}
    />
  );

  const renderSearchResult = ({ item }: { item: Movie }) => (
    <SearchResultCard movie={item} onPress={() => handleMoviePress(item.id)} />
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <SearchHeader
        isSearching={isSearching}
        searchQuery={searchQuery}
        searchResults={showSearchResults ? searchResults.length : 0}
        onSearchPress={handleSearchPress}
        onCloseSearch={handleCloseSearch}
        onSearchChange={setSearchQuery}
        onBackPress={selectedGenre ? handleBackFromGenre : undefined}
        showBackButton={!!selectedGenre}
        selectedGenre={selectedGenre?.title}
        genreMoviesCount={selectedGenre ? genreMovies.length : undefined}
        isTyping={isTyping}
      />

      {selectedGenre ? (
        <FlatList
          data={genreMovies}
          renderItem={renderSearchResult}
          keyExtractor={(item) => item.id.toString()}
          style={styles.searchResults}
        />
      ) : isSearching ? (
        showSearchResults ? (
          <FlatList
            data={searchResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id.toString()}
            style={styles.searchResults}
          />
        ) : (
          <View style={styles.categoriesContainer}>
            <FlatList
              data={categories}
              renderItem={renderCategoryCard}
              keyExtractor={(item) => item.title}
              numColumns={2}
              contentContainerStyle={styles.categoriesContent}
            />
          </View>
        )
      ) : (
        <FlatList
          data={movies}
          renderItem={renderMovieCard}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.moviesList}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  moviesList: {
    paddingBottom: 20,
  },
  categoriesContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  categoriesContent: {
    padding: 8,
  },
  searchResults: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
