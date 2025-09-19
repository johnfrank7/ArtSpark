import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../utils/firebaseConfig";

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
        <Text style={styles.title}>Create Account</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* 🔹 Role Picker */}
        <Text style={styles.label}>Select Role</Text>
        <Picker
          selectedValue={role}
          style={styles.input}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Artist" value="Artist" />
          <Picker.Item label="Digital Artist" value="Digital Artist" />
          <Picker.Item label="Photographer" value="Photographer" />
        </Picker>

        {/* 🔴 Error Message */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.buttonWrapper}>
          <Button title="Sign Up" onPress={handleSignup} />
        </View>

        <Text style={styles.orText}>Already have an account?</Text>

        <View style={styles.smallButtonWrapper}>
          <Button title="Login" onPress={() => router.push("/login")} />
        </View>

        <View style={styles.smallButtonWrapper}>
          <Button title="Back" color="gray" onPress={() => router.replace("/")} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  card: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#444",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonWrapper: {
    marginVertical: 10,
  },
  smallButtonWrapper: {
    marginVertical: 5,
  },
  orText: {
    textAlign: "center",
    marginTop: 15,
    marginBottom: 8,
    color: "#666",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
});
