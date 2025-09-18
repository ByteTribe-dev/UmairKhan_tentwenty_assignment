import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Colors } from "../constants/theme";
import { Text } from "./Text";

interface SearchHeaderProps {
  isSearching: boolean;
  searchQuery: string;
  searchResults: number;
  onSearchPress: () => void;
  onCloseSearch: () => void;
  onSearchChange: (text: string) => void;
  onBackPress?: () => void;
  showBackButton?: boolean;
  selectedGenre?: string;
  genreMoviesCount?: number;
  isTyping?: boolean;
}

export const SearchHeader: React.FC<SearchHeaderProps> = ({
  isSearching,
  searchQuery,
  searchResults,
  onSearchPress,
  onCloseSearch,
  onSearchChange,
  onBackPress,
  showBackButton = false,
  selectedGenre,
  genreMoviesCount,
  isTyping = false,
}) => {
  // Show genre results header
  if (selectedGenre && genreMoviesCount !== undefined) {
    return (
      <View style={styles.searchContainer}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <Text
          variant="medium"
          size="lg"
          color={Colors.primary}
          style={styles.resultsText}
        >
          {selectedGenre} ({genreMoviesCount} movies)
        </Text>

        <TouchableOpacity onPress={onCloseSearch} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  if (isSearching) {
    return (
      <View style={styles.searchContainer}>
        {showBackButton ? (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
        ) : null}

        {searchResults > 0 && !isTyping && searchQuery.length > 0 ? (
          <Text
            variant="medium"
            size="lg"
            color={Colors.primary}
            style={styles.resultsText}
          >
            {searchResults} Results Found
          </Text>
        ) : (
          <View style={styles.searchInputContainer}>
            <Ionicons
              name="search"
              size={20}
              color={Colors.textSecondary}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="TV shows, movies and more"
              placeholderTextColor={Colors.textSecondary}
              value={searchQuery}
              onChangeText={onSearchChange}
              autoFocus={searchQuery.length === 0}
            />
          </View>
        )}

        <TouchableOpacity onPress={onCloseSearch} style={styles.closeButton}>
          <Ionicons name="close" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.headerContainer}>
      <Text variant="semiBold" size="md" color={Colors.textColor}>
        Watch
      </Text>
      <TouchableOpacity onPress={onSearchPress}>
        <Ionicons name="search" size={24} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.white,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.border,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.primary,
    fontFamily: "System",
  },
  closeButton: {
    padding: 4,
  },
  backButton: {
    padding: 4,
  },
  resultsText: {
    flex: 1,
    marginLeft: 8,
  },
});
