import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Animated,
} from "react-native";
import {
  savePhoto,
  getUserPhotos,
  deletePhoto,
} from "../utils/firestoreHelpers";
import { UNSPLASH_ACCESS_KEY } from "../utils/unsplashConfig";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [savedPhotos, setSavedPhotos] = useState([]);

  const searchPhotos = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${query}&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setResults(data.results || []);
    } catch (error) {
      console.error("Error fetching Unsplash images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (url) => {
    await savePhoto(url);
    loadSavedPhotos();
  };

  const handleDelete = async (id) => {
    await deletePhoto(id);
    loadSavedPhotos();
  };

  const loadSavedPhotos = async () => {
    const photos = await getUserPhotos();
    setSavedPhotos(photos);
  };

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  // Split results into 2 columns (Pinterest style)
  const column1 = results.filter((_, i) => i % 2 === 0);
  const column2 = results.filter((_, i) => i % 2 !== 0);

  const ZoomableImage = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const onPressIn = () => {
      Animated.spring(scaleAnim, { toValue: 1.05, useNativeDriver: true }).start();
    };
    const onPressOut = () => {
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
    };

    return (
      <View style={styles.imageWrapper}>
        <Animated.View style={[styles.imageContainer, { transform: [{ scale: scaleAnim }] }]}>
          <TouchableOpacity
            activeOpacity={1}
            onPressIn={onPressIn}
            onPressOut={onPressOut}
          >
            <Image source={{ uri: item.urls.small }} style={styles.image} resizeMode="cover" />
          </TouchableOpacity>

          {/* Overlay download button */}
          <TouchableOpacity
            style={styles.overlayButton}
            onPress={() => handleSave(item.urls.small)}
          >
            <Text style={styles.downloadIcon}>⬇️</Text>
          </TouchableOpacity>
        </Animated.View>
        <Text style={styles.caption}>{item.user.name}</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Search Photos</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter keyword (e.g. nature)"
        value={query}
        onChangeText={setQuery}
      />

      <TouchableOpacity style={styles.searchButton} onPress={searchPhotos}>
        <Text style={styles.searchText}>Search</Text>
      </TouchableOpacity>

      {loading ? (
        <Text style={styles.loading}>Loading...</Text>
      ) : (
        <View style={styles.masonryContainer}>
          <View style={styles.column}>
            {column1.map((item) => (
              <ZoomableImage key={item.id} item={item} />
            ))}
          </View>
          <View style={styles.column}>
            {column2.map((item) => (
              <ZoomableImage key={item.id} item={item} />
            ))}
          </View>
        </View>
      )}

      <Text style={styles.savedTitle}>⭐ Saved Photos</Text>
      <View style={styles.savedWrapper}>
        {savedPhotos.map((item) => (
          <View key={item.id} style={styles.imageWrapper}>
            <Image source={{ uri: item.url }} style={styles.image} />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDelete(item.id)}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20,
  },
  searchText: { color: "white", fontWeight: "bold" },
  loading: { marginTop: 20, textAlign: "center", fontSize: 16 },

  masonryContainer: { flexDirection: "row", justifyContent: "space-between" },
  column: { flex: 1, marginHorizontal: 4 },

  imageWrapper: { marginBottom: 12, alignItems: "center" },
  imageContainer: {
    position: "relative",
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 200, // ✅ fixed size so consistent ang layout
    borderRadius: 10,
  },
  caption: { marginTop: 4, fontSize: 12, textAlign: "center" },

  overlayButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.8)",
    borderRadius: 20,
    padding: 6,
  },
  downloadIcon: { fontSize: 16 },

  savedTitle: { marginTop: 20, fontWeight: "bold", fontSize: 16 },
  savedWrapper: { flexDirection: "row", flexWrap: "wrap" },

  deleteButton: {
    marginTop: 6,
    padding: 6,
    borderRadius: 6,
    backgroundColor: "red",
    alignItems: "center",
    width: 100,
  },
  deleteText: { color: "white", fontWeight: "bold" },
});
