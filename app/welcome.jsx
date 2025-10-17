
import { View, Text, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import shining from "../assets/images/shining.png"; 

export default function Welcome() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ArtSpark</Text>
      <Image 
            source={shining} 
            style={{ width: 28, height: 28, marginLeft: 6 }} 
            resizeMode="contain"
          />
      <Text style={styles.subtitle}>
        Discover and share creativity with the world.
      </Text>
      <View style={styles.buttonWrapper}>
        <Button
          title="Get Started"
          onPress={() => router.push("/login")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  buttonWrapper: {
    width: "60%",
    marginVertical: 8,
  },
});
