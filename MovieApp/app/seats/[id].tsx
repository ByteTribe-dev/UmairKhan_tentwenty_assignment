import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
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

const { width } = Dimensions.get("window");

interface Seat {
  row: number;
  number: number;
  type: "regular" | "vip" | "unavailable";
  selected: boolean;
}

const generateSeats = (): Seat[] => {
  const seats: Seat[] = [];

  for (let row = 1; row <= 10; row++) {
    for (let number = 1; number <= 20; number++) {
      let type: "regular" | "vip" | "unavailable" = "regular";

      // VIP seats (last row)
      if (row === 10) {
        type = "vip";
      }

      // Some unavailable seats (random)
      if (Math.random() > 0.85) {
        type = "unavailable";
      }

      // Selected seat example (row 4, seat 4)
      const selected = row === 4 && number === 4;

      seats.push({
        row,
        number,
        type,
        selected,
      });
    }
  }

  return seats;
};

function SeatsScreen() {
  const { id } = useLocalSearchParams();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [seats, setSeats] = useState<Seat[]>(generateSeats());
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

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

  useEffect(() => {
    if (id) {
      loadMovieDetails();
    }
  }, [id, loadMovieDetails]);

  useEffect(() => {
    // Update selected seats list
    const selected = seats.filter((seat) => seat.selected);
    setSelectedSeats(selected);
  }, [seats]);

  const handleSeatPress = (seatToToggle: Seat) => {
    if (seatToToggle.type === "unavailable") return;

    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.row === seatToToggle.row && seat.number === seatToToggle.number
          ? { ...seat, selected: !seat.selected }
          : seat
      )
    );
  };

  const getSeatPrice = (seat: Seat) => {
    return seat.type === "vip" ? 150 : 50;
  };

  const getTotalPrice = () => {
    return selectedSeats.reduce((total, seat) => total + getSeatPrice(seat), 0);
  };

  const handleProceedToPay = () => {
    // Navigate to payment screen (to be implemented)
    alert("Payment screen coming soon!");
  };

  const renderSeat = (seat: Seat) => {
    const seatStyles = [styles.seat];

    // Add type-specific style
    if (seat.type === "regular") {
      seatStyles.push(styles.regularSeat);
    } else if (seat.type === "vip") {
      seatStyles.push(styles.vipSeat);
    } else if (seat.type === "unavailable") {
      seatStyles.push(styles.unavailableSeat);
    }

    // Add selected style if selected
    if (seat.selected) {
      seatStyles.push(styles.selectedSeat);
    }

    return (
      <TouchableOpacity
        key={`${seat.row}-${seat.number}`}
        style={seatStyles}
        onPress={() => handleSeatPress(seat)}
        disabled={seat.type === "unavailable"}
      />
    );
  };

  const renderRow = (rowNumber: number) => {
    const rowSeats = seats.filter((seat) => seat.row === rowNumber);

    return (
      <View key={rowNumber} style={styles.seatRow}>
        <Text
          variant="medium"
          size="sm"
          color={Colors.textSecondary}
          style={styles.rowNumber}
        >
          {rowNumber}
        </Text>
        <View style={styles.seatsContainer}>{rowSeats.map(renderSeat)}</View>
      </View>
    );
  };

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

      {/* Full Header with Status Bar */}
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
              March 5, 2021 | 12:30 Hall 1
            </Text>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Screen */}
        <View style={styles.screenContainer}>
          <View style={styles.screen}>
            <Text variant="medium" size="sm" color={Colors.textSecondary}>
              SCREEN
            </Text>
          </View>
        </View>

        {/* Seat Map */}
        <View style={styles.seatMap}>
          {Array.from({ length: 10 }, (_, index) => renderRow(index + 1))}
        </View>

        {/* Zoom Controls */}
        <View style={styles.zoomControls}>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomButton}>
            <Ionicons name="remove" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.selectedSeat]} />
              <Text variant="regular" size="sm" color={Colors.textSecondary}>
                Selected
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.unavailableSeat]} />
              <Text variant="regular" size="sm" color={Colors.textSecondary}>
                Not available
              </Text>
            </View>
          </View>
          <View style={styles.legendRow}>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.vipSeat]} />
              <Text variant="regular" size="sm" color={Colors.textSecondary}>
                VIP (150$)
              </Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendSeat, styles.regularSeat]} />
              <Text variant="regular" size="sm" color={Colors.textSecondary}>
                Regular (50 $)
              </Text>
            </View>
          </View>
        </View>

        {/* Selected Seats Info */}
        {selectedSeats.length > 0 && (
          <View style={styles.selectedSeatsInfo}>
            <View style={styles.selectedSeatTag}>
              <Text variant="bold" size="md" color={Colors.white}>
                {selectedSeats[0].row}
              </Text>
              <Text variant="regular" size="sm" color={Colors.white}>
                / {selectedSeats[0].number} row
              </Text>
              <TouchableOpacity style={styles.removeSeatButton}>
                <Ionicons name="close" size={16} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Section */}
      <SafeAreaView edges={["bottom"]} style={styles.bottomContainer}>
        <View style={styles.priceSection}>
          <Text variant="regular" size="sm" color={Colors.textSecondary}>
            Total Price
          </Text>
          <Text variant="bold" size="xl" color={Colors.primary}>
            $ {getTotalPrice()}
          </Text>
        </View>
        <Button
          title="Proceed to pay"
          onPress={handleProceedToPay}
          variant="primary"
          size="large"
          style={styles.proceedButton}
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
  screenContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  screen: {
    width: width * 0.8,
    height: 40,
    backgroundColor: Colors.white,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  seatMap: {
    alignItems: "center",
    marginBottom: 20,
  },
  seatRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rowNumber: {
    width: 20,
    textAlign: "center",
    marginRight: 10,
  },
  seatsContainer: {
    flexDirection: "row",
    gap: 4,
  },
  seat: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginHorizontal: 1,
  },
  regularSeat: {
    backgroundColor: Colors.accent,
  },
  vipSeat: {
    backgroundColor: Colors.purple,
  },
  unavailableSeat: {
    backgroundColor: Colors.textSecondary,
  },
  selectedSeat: {
    backgroundColor: Colors.yellow,
  },
  zoomControls: {
    position: "absolute",
    right: 20,
    bottom: 200,
    gap: 10,
  },
  zoomButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  legend: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  legendSeat: {
    width: 16,
    height: 16,
    borderRadius: 3,
    marginRight: 8,
  },
  selectedSeatsInfo: {
    marginBottom: 20,
  },
  selectedSeatTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: "flex-start",
  },
  removeSeatButton: {
    marginLeft: 8,
    padding: 2,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  priceSection: {
    flex: 1,
  },
  proceedButton: {
    flex: 2,
    marginLeft: 16,
  },
});

export default SeatsScreen;
