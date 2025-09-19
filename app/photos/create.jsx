import React, { useState } from "react";
import { 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  Alert, 
  Text, 
  ScrollView,
  ActivityIndicator 
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { savePhoto } from "../../utils/firestoreHelpers";
import { auth, storage } from "../../utils/firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function CreatePhoto() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const pickImage = async () => {
    try {
      setError("");
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission required", "We need access to your photos to upload.");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      setError(e.message);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Please enter a title for your photo");
      return;
    }
    if (!image) {
      setError("Please select an image to upload");
      return;
    }

    try {
      setUploading(true);
      setError("");

      console.log("Starting upload process...");
      
      // Check if user is authenticated
      if (!auth.currentUser) {
        throw new Error("User not authenticated. Please log in again.");
      }
      
      // Convert image to blob with better error handling
      const response = await fetch(image);
      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }
      
      const blob = await response.blob();
      console.log("Image blob created, size:", blob.size);
      
      let downloadUrl;
      
      try {
        // Try Firebase Storage first
        const fileName = `photos/${auth.currentUser.uid}_${Date.now()}.jpg`;
        const storageRef = ref(storage, fileName);
        console.log("Uploading to Firebase Storage:", fileName);
        
        const uploadTask = await uploadBytes(storageRef, blob);
        console.log("Upload completed:", uploadTask);
        
        downloadUrl = await getDownloadURL(storageRef);
        console.log("Download URL obtained:", downloadUrl);
      } catch (storageError) {
        console.warn("Firebase Storage failed, using image URL directly:", storageError);
        // Fallback: use the original image URL
        downloadUrl = image;
      }

      // Save metadata to Firestore
      console.log("Saving to Firestore...");
      await savePhoto({
        title: title.trim(),
        url: downloadUrl,
        ownerId: auth.currentUser.uid,
        ownerEmail: auth.currentUser.email,
      });

      console.log("Upload successful!");
      Alert.alert("Success! 🎉", "Your photo has been uploaded successfully!");
      router.back();
    } catch (err) {
      console.error("Upload error:", err);
      setError(`Upload failed: ${err.message}`);
      Alert.alert("Upload Error", `Failed to upload photo: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📸 Share Your Art</Text>
        <Text style={styles.subtitle}>Upload a photo to inspire others</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Photo Title</Text>
          <TextInput
            placeholder="Give your photo a creative title..."
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            maxLength={50}
          />
        </View>

        <View style={styles.imageSection}>
          <Text style={styles.label}>Select Image</Text>
          {image ? (
            <View style={styles.imagePreview}>
              <Image source={{ uri: image }} style={styles.previewImage} />
              <TouchableOpacity 
                style={styles.changeImageButton}
                onPress={pickImage}
              >
                <Text style={styles.changeImageText}>🔄 Change Image</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
              <Text style={styles.pickerIcon}>📷</Text>
              <Text style={styles.pickerText}>Choose from Gallery</Text>
              <Text style={styles.pickerSubtext}>Tap to select an image</Text>
            </TouchableOpacity>
          )}
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <TouchableOpacity
          style={[
            styles.uploadButton,
            (!title.trim() || !image || uploading) && styles.uploadButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!title.trim() || !image || uploading}
        >
          {uploading ? (
            <View style={styles.uploadingContainer}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.uploadingText}>Uploading...</Text>
            </View>
          ) : (
            <View style={styles.uploadContainer}>
              <Text style={styles.uploadIcon}>🚀</Text>
              <Text style={styles.uploadText}>Upload Photo</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFE4B5" 
  },
  header: {
    backgroundColor: "transparent",
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
    borderBottomWidth: 0,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#8B4513",
    marginBottom: 8,
    fontStyle: "italic",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center"
  },
  form: {
    padding: 20
  },
  inputGroup: {
    marginBottom: 24
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: 8
  },
  input: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#2c3e50"
  },
  imageSection: {
    marginBottom: 24
  },
  imagePicker: {
    borderWidth: 2,
    borderColor: "#dee2e6",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 40,
    alignItems: "center",
    backgroundColor: "#f8f9fa"
  },
  pickerIcon: {
    fontSize: 48,
    marginBottom: 12
  },
  pickerText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#495057",
    marginBottom: 4
  },
  pickerSubtext: {
    fontSize: 14,
    color: "#6c757d"
  },
  imagePreview: {
    position: "relative"
  },
  previewImage: {
    width: "100%",
    height: 250,
    borderRadius: 12,
    backgroundColor: "#f8f9fa"
  },
  changeImageButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20
  },
  changeImageText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600"
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8d7da",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f5c6cb"
  },
  errorIcon: {
    fontSize: 16,
    marginRight: 8
  },
  errorText: {
    color: "#721c24",
    fontSize: 14,
    flex: 1
  },
  uploadButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  uploadButtonDisabled: {
    backgroundColor: "#6c757d",
    shadowOpacity: 0
  },
  uploadContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadIcon: {
    fontSize: 20,
    marginRight: 8
  },
  uploadText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  uploadingContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  uploadingText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8
  }
});
