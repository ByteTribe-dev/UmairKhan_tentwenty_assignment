import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import YoutubePlayer from "react-native-youtube-iframe";
import { Colors } from "../constants/theme";
import { Text } from "./Text";

const { width, height } = Dimensions.get("window");

interface VideoPlayerProps {
  visible: boolean;
  videoKey: string;
  onClose: () => void;
}

export function VideoPlayer({ visible, videoKey, onClose }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleStateChange = (state: string) => {
    if (state === "ended") {
      // Auto-close when video finishes
      onClose();
    } else if (state === "playing") {
      setIsPlaying(true);
    } else if (state === "paused") {
      setIsPlaying(false);
    }
  };

  const handleClose = () => {
    setIsPlaying(false);
    onClose();
  };

  const handleReady = () => {
    // Auto-play when ready
    setIsPlaying(true);
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      presentationStyle="fullScreen"
      onRequestClose={handleClose}
    >
      <StatusBar hidden />
      <View style={styles.container}>
        {/* Close button */}
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text variant="medium" size="md" color={Colors.white}>
            Done
          </Text>
        </TouchableOpacity>

        {/* Video player */}
        <View style={styles.videoContainer}>
          <YoutubePlayer
            height={height * 0.6}
            width={width}
            play={isPlaying}
            videoId={videoKey}
            onChangeState={handleStateChange}
            onReady={handleReady}
            initialPlayerParams={{
              controls: true,
              showClosedCaptions: false,
              preventFullScreen: false,
              loop: false,
            }}
          />
        </View>

        {/* Trailer info */}
        <View style={styles.infoContainer}>
          <Text
            variant="regular"
            size="sm"
            color={Colors.white}
            style={styles.trailerTitle}
          >
            Movie Trailer
          </Text>
          <Text variant="regular" size="xs" color={Colors.textSecondary}>
            YouTube ID: {videoKey}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  videoContainer: {
    width: width,
    height: height * 0.6,
    justifyContent: "center",
    alignItems: "center",
  },
  infoContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    alignItems: "center",
  },
  trailerTitle: {
    marginBottom: 8,
    fontWeight: "bold",
  },
});
