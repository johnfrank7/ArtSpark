import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { app } from "../utils/firebaseConfig";

export default function Login() {
  const router = useRouter();
  const auth = getAuth(app);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorMessage("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch (error) {
      // 🔹 Simplify messages
      if (
        error.code === "auth/invalid-email" ||
        error.code === "auth/invalid-credential" ||
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found"
      ) {
        setErrorMessage("Invalid email or password.");
      } else if (error.code === "auth/too-many-requests") {
        setErrorMessage("Too many attempts. Try again later.");
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Login to ArtSpark</Text>

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

        {/* 🔴 Error Message */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <View style={styles.buttonWrapper}>
          <Button title="Login" onPress={handleLogin} />
        </View>

        <Text style={styles.orText}>Don’t have an account?</Text>

        {/* Sign Up */}
        <View style={styles.smallButtonWrapper}>
          <Button title="Sign Up" onPress={() => router.push("/signup")} />
        </View>

        {/* Back */}
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
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  buttonWrapper: {
    marginVertical: 10, // ✅ tighter spacing
  },
  smallButtonWrapper: {
    marginVertical: 5, // ✅ smaller gaps for SignUp/Back
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
