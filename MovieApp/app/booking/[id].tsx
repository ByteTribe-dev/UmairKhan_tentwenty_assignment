/**
 * Booking Screen
 * Displays date selection and showtime options for movie booking
 */

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "../../components/Button";
import { Text } from "../../components/Text";
import { Colors } from "../../constants/theme";
import { MovieDetails, api } from "../../services/api";

// Mock data for showtimes
interface ShowTime {
  time: string;
  cinema: string;
  hall: string;
  price: number;
  bonus: number;
}

const mockShowTimes: ShowTime[] = [
  { time: "12:30", cinema: "Cinetech", hall: "Hall 1", price: 50, bonus: 2500 },
  { time: "13:30", cinema: "Cinetech", hall: "Hall 2", price: 75, bonus: 3000 },
  { time: "15:30", cinema: "Cinetech", hall: "Hall 1", price: 60, bonus: 2800 },
  { time: "18:00", cinema: "Cinetech", hall: "Hall 3", price: 80, bonus: 3200 },
];

// Mock data for dates
const dates = [
  { day: "5", month: "Mar", selected: true },
  { day: "6", month: "Mar", selected: false },
  { day: "7", month: "Mar", selected: false },
  { day: "8", month: "Mar", selected: false },
  { day: "9", month: "Mar", selected: false },
];

function BookingScreen() {
  const { id } = useLocalSearchParams();

  // State management
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);

  /**
   * Load movie details
   */
  const loadMovieDetails = useCallback(async () => {
    try {
      const movieId = parseInt(id as string);
      const movieData = await api.getMovieDetails(movieId);
      setMovie(movieData);
    } catch (error) {
      console.error("Error loading movie details:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  /**
   * Navigate to seat selection
   */
  const handleSelectSeats = () => {
    router.push(`/seats/${id}`);
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
      <View style={styles.container}>
        <SafeAreaView style={styles.loadingContainer}>
          <Text variant="medium" size="lg" color={Colors.primary}>
            Loading...
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Custom Header */}
      <SafeAreaView style={styles.headerContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <View style={styles.headerContent}>
            <Text variant="bold" size="lg" color={Colors.primary}>
              {movie.title}
            </Text>
            <Text variant="regular" size="sm" color={Colors.accent}>
              In Theaters{" "}
              {new Date(movie.release_date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Date Selection */}
        <View style={styles.section}>
          <Text
            variant="bold"
            size="xl"
            color={Colors.primary}
            style={styles.sectionTitle}
          >
            Date
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.dateScroll}
          >
            {dates.map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dateButton,
                  selectedDate === index && styles.selectedDateButton,
                ]}
                onPress={() => setSelectedDate(index)}
              >
                <Text
                  variant="medium"
                  size="md"
                  color={selectedDate === index ? Colors.white : Colors.primary}
                >
                  {date.day} {date.month}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Showtime Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.showTimesScroll}
        >
          {mockShowTimes.map((showTime, index) => (
            <View key={index} style={styles.showTimeContainer}>
              {/* Time and Cinema Info - Outside the card */}
              <View style={styles.showTimeHeader}>
                <Text variant="bold" size="lg" color={Colors.primary}>
                  {showTime.time}
                </Text>
                <Text variant="regular" size="sm" color={Colors.textSecondary}>
                  {showTime.cinema} + {showTime.hall}
                </Text>
              </View>

              {/* Seat Map Card - Only contains the seat map */}
              <View style={styles.seatMapCard}>
                <View style={styles.detailedSeatMap}>
                  {/* Screen indicator */}
                  <View style={styles.miniScreen} />

                  {/* Seat rows */}
                  {Array.from({ length: 10 }, (_, row) => (
                    <View key={row} style={styles.miniSeatRow}>
                      {Array.from({ length: 16 }, (_, seat) => {
                        // Generate random seat colors for visual variety
                        const seatType = Math.random();
                        let seatColor = Colors.accent; // Regular seats (blue)

                        if (seatType > 0.9) {
                          seatColor = Colors.pink; // Some pink seats
                        } else if (seatType > 0.85) {
                          seatColor = Colors.success; // Some green seats
                        } else if (seatType > 0.75) {
                          seatColor = Colors.textSecondary; // Unavailable seats (gray)
                        }

                        return (
                          <View
                            key={seat}
                            style={[
                              styles.detailedSeat,
                              { backgroundColor: seatColor },
                            ]}
                          />
                        );
                      })}
                    </View>
                  ))}
                </View>
              </View>

              {/* Price Info - Outside the card */}
              <View style={styles.priceContainer}>
                <Text variant="regular" size="sm" color={Colors.textSecondary}>
                  From{" "}
                  <Text variant="bold" color={Colors.primary}>
                    {showTime.price}$
                  </Text>{" "}
                  or{" "}
                  <Text variant="bold" color={Colors.primary}>
                    {showTime.bonus} bonus
                  </Text>
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Bottom Action Button */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomContainer}>
        <Button
          title="Select Seats"
          onPress={handleSelectSeats}
          variant="primary"
          size="large"
          style={styles.selectSeatsButton}
        />
      </SafeAreaView>
    </View>
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
  headerContainer: {
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    marginRight: 16,
  },
  headerContent: {
    flex: 1,
    alignItems: "center",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  dateScroll: {
    marginBottom: 8,
  },
  dateButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginRight: 12,
    borderRadius: 25,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedDateButton: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  showTimesScroll: {
    paddingLeft: 20,
  },
  showTimeContainer: {
    marginRight: 20,
    width: 300,
  },
  showTimeHeader: {
    marginBottom: 12,
  },
  seatMapCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: Colors.accent,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  detailedSeatMap: {
    alignItems: "center",
    gap: 4,
  },
  miniScreen: {
    width: 140,
    height: 4,
    backgroundColor: Colors.border,
    borderRadius: 20,
    marginBottom: 12,
  },
  miniSeatRow: {
    flexDirection: "row",
    gap: 4,
  },
  detailedSeat: {
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  priceContainer: {
    alignItems: "center",
  },
  bottomContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  selectSeatsButton: {
    width: "100%",
  },
});

export default BookingScreen;
