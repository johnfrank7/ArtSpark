import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth, db } from "../utils/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import * as ImagePicker from 'expo-image-picker';
import { useState, useEffect } from 'react';

export default function Profile() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const [profileImage, setProfileImage] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get email from params or current user
    const currentEmail = email || auth.currentUser?.email || 'No email available';
    setUserEmail(currentEmail);
    
    // Fetch user role from Firestore
    const fetchUserRole = async () => {
      try {
        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role || 'Artist');
          } else {
            setUserRole('Artist'); // Default role
          }
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setUserRole('Artist'); // Default fallback
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [email]);

  const pickImage = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        Alert.alert('Permission Required', 'Permission to access camera roll is required!');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setProfileImage(result.assets[0].uri);
        Alert.alert('Success', 'Profile picture updated!');
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  const getRoleEmoji = (role) => {
    switch (role) {
      case 'Artist':
        return '🎨';
      case 'Digital Artist':
        return '💻';
      case 'Photographer':
        return '📸';
      default:
        return '🎨';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.card}>
        <TouchableOpacity style={styles.profileIcon} onPress={pickImage}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Text style={styles.profileEmoji}>👤</Text>
          )}
          <View style={styles.cameraIcon}>
            <Text style={styles.cameraEmoji}>📷</Text>
          </View>
        </TouchableOpacity>
        
        <Text style={styles.title}>My Profile</Text>
        
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userEmail}</Text>
        
        <Text style={styles.label}>Role:</Text>
        <Text style={styles.roleValue}>
          {loading ? 'Loading...' : getRoleEmoji(userRole) + ' ' + userRole}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={() => router.replace("/")}
          >
            <Text style={styles.buttonText}>🏠 Back to Home</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => router.push("/search")}
          >
            <Text style={styles.buttonText}>🔍 Go to Search</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.dangerButton} 
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>🚪 Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4B5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "transparent",
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.9)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 22,
    color: "#8B4513"
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#8B4513",
    fontStyle: "italic",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  placeholder: {
    width: 36
  },
  card: {
    flex: 1,
    margin: 20,
    backgroundColor: "rgba(255,255,255,0.9)",
    padding: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    alignItems: "center",
  },
  profileIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#8B4513",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    position: "relative",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  profileEmoji: {
    fontSize: 45,
    color: "#fff"
  },
  cameraIcon: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FF8C42",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraEmoji: {
    fontSize: 14,
    color: "#fff"
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#8B4513",
    fontStyle: "italic",
    textShadowColor: "rgba(255,255,255,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 15,
    color: "#8B4513",
    textAlign: "center",
  },
  value: {
    fontSize: 16,
    marginBottom: 20,
    color: "#6B8E23",
    textAlign: "center",
    backgroundColor: "rgba(107, 142, 35, 0.15)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(107, 142, 35, 0.4)",
    fontWeight: "600",
  },
  roleValue: {
    fontSize: 18,
    marginBottom: 35,
    color: "#8B4513",
    textAlign: "center",
    backgroundColor: "rgba(139, 69, 19, 0.15)",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(139, 69, 19, 0.4)",
    fontWeight: "bold",
  },
  buttonContainer: {
    width: "100%",
    gap: 18,
    marginTop: 10,
  },
  primaryButton: {
    backgroundColor: "#6B8E23",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryButton: {
    backgroundColor: "#FF8C42",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  dangerButton: {
    backgroundColor: "#dc3545",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
