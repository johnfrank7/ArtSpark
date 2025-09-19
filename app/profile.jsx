import { useRouter, useLocalSearchParams } from "expo-router";
import { View, Text, Button, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../utils/firebaseConfig";

export default function Profile() {
  const router = useRouter();
  const { email } = useLocalSearchParams(); // ✅ kuha sa email gikan sa query

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{email || "No email available"}</Text>

        <View style={styles.buttonWrapper}>
          <Button title="Back to Home" onPress={() => router.replace("/")} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Go to Search" onPress={() => router.push("/search")} />
        </View>

        <View style={styles.buttonWrapper}>
          <Button title="Logout" color="red" onPress={handleLogout} />
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
    fontWeight: "bold",
    marginTop: 10,
    color: "#444",
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
    color: "#555",
  },
  buttonWrapper: {
    marginVertical: 8,
  },
});
