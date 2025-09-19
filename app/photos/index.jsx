// app/photos/index.jsx
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { auth } from "../../utils/firebaseConfig";
import { subscribeAllPhotos, deletePhoto } from "../../utils/firestoreHelpers";

export default function PhotosHome() {
  const router = useRouter();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // real-time listener
    const unsubscribe = subscribeAllPhotos((newPhotos) => {
      setPhotos(newPhotos);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleDelete = async (photo) => {
    try {
      await deletePhoto(photo.id, photo.ownerId);
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  const renderItem = ({ item }) => {
    const isOwner = auth.currentUser?.uid === item.ownerId;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image 
            source={{ 
              uri: item.url,
              headers: Platform.OS === 'web' ? {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET',
                'Access-Control-Allow-Headers': 'Content-Type',
              } : undefined
            }} 
            style={styles.image}
            resizeMode="cover"
            onError={(error) => {
              console.log('Image load error:', error.nativeEvent.error);
            }}
            onLoad={() => {
              console.log('Image loaded successfully:', item.url);
            }}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageTitle}>{item.title}</Text>
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.ownerInfo}>
            <Text style={styles.ownerIcon}>👤</Text>
            <Text style={styles.owner}>{item.ownerEmail}</Text>
          </View>

          {isOwner && (
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => router.push(`/photos/edit/${item.id}`)}
              >
                <Text style={styles.actionIcon}>✏️</Text>
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteAction]}
                onPress={() => handleDelete(item)}
              >
                <Text style={styles.actionIcon}>🗑️</Text>
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with Profile + Search */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/profile")} style={styles.headerButton}>
          <Text style={styles.headerIcon}>👤</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>ArtSpark✨</Text>
        <TouchableOpacity onPress={() => router.push("/search")} style={styles.headerButton}>
          <Text style={styles.headerIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Feed */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading photos...</Text>
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📸</Text>
          <Text style={styles.emptyTitle}>No photos yet</Text>
          <Text style={styles.emptySubtitle}>Be the first to share your art!</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}

      {/* Floating add button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push("/photos/create")}
      >
        <Text style={styles.fabIcon}>📷</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#f8f9fa" 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#f8f9fa"
  },
  headerIcon: { 
    fontSize: 20, 
    color: "#495057" 
  },
  logo: { 
    fontSize: 24, 
    fontWeight: "bold", 
    color: "#2c3e50" 
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6c757d"
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 40
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center"
  },

  list: { 
    padding: 12 
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 12
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 6,
    marginBottom: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  imageContainer: {
    position: "relative",
    aspectRatio: 1,
    overflow: "hidden"
  },
  image: { 
    width: "100%", 
    height: "100%",
    backgroundColor: "#f8f9fa"
  },
  imageOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 8,
    paddingHorizontal: 12
  },
  imageTitle: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center"
  },
  
  cardContent: {
    padding: 12
  },
  ownerInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8
  },
  ownerIcon: {
    fontSize: 14,
    marginRight: 6
  },
  owner: { 
    fontSize: 12, 
    color: "#6c757d",
    flex: 1
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flex: 1,
    marginHorizontal: 4,
    justifyContent: "center"
  },
  deleteAction: {
    backgroundColor: "#dc3545"
  },
  actionIcon: {
    fontSize: 12,
    marginRight: 4
  },
  actionText: { 
    color: "#fff", 
    fontSize: 12,
    fontWeight: "600" 
  },

  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#007AFF",
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  fabIcon: { 
    fontSize: 24, 
    color: "#fff" 
  },
});
