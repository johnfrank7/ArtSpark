import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ScrollView, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";
import shining from "../assets/images/shining.png"; 

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Artist"); // default role
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignup = async () => {
    setErrorMessage("");
    try {
      // 🔹 Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔹 Save profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        role: role,
        createdAt: new Date(),
      });

      router.replace("/login"); 
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("This email is already registered.");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Please enter a valid email address.");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("Password must be at least 6 characters.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>✨ Join ArtSpark</Text>
        <Text style={styles.subtitle}>Create your account and start sharing your art</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email..."
            placeholderTextColor="#6c757d"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a secure password..."
            placeholderTextColor="#6c757d"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Choose Your Role</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={role}
              style={styles.picker}
              onValueChange={(itemValue) => setRole(itemValue)}
            >
              <Picker.Item label="🎨 Artist" value="Artist" />
              <Picker.Item label="💻 Digital Artist" value="Digital Artist" />
              <Picker.Item label="📸 Photographer" value="Photographer" />
            </Picker>
          </View>
        </View>

        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <View style={styles.buttonContent}>
            
            <Text style={styles.buttonText}>Create Account</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={() => router.push("/login")}>
          <View style={styles.buttonContent}>
          
            <Text style={styles.loginButtonText}>Already have an account?</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={() => router.replace("/")}>
          <Text style={styles.backButtonText}>← Back to Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFE4B5",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
    color: "#8B4513",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 16,
    color: "#6c757d",
    textAlign: "center",
    marginBottom: 24
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
  pickerContainer: {
    borderWidth: 2,
    borderColor: "#e9ecef",
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden"
  },
  picker: {
    height: 50,
    color: "#2c3e50"
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
  signupButton: {
    backgroundColor: "#28a745",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#28a745",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16
  },
  loginButton: {
    backgroundColor: "#007bff",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#007bff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 16
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center"
  },
  buttonIcon: {
    fontSize: 20,
    marginRight: 8
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold"
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#dee2e6"
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6c757d",
    fontSize: 14,
    fontWeight: "500"
  },
  backButton: {
    alignItems: "center",
    paddingVertical: 12
  },
  backButtonText: {
    color: "#6c757d",
    fontSize: 16,
    fontWeight: "500"
  }
});
