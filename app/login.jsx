import { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }

    try {
      
      const userData = { email, token: "fake-jwt-token" };

    
      await AsyncStorage.setItem("user", JSON.stringify(userData));

     
      router.replace("/");
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center px-4">
      <Text className="text-2xl font-bold mb-4">Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="w-full border p-2 mb-2 rounded"
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="w-full border p-2 mb-4 rounded"
      />

      <Button title="Login" onPress={handleLogin} />
      <View className="mt-4">
        <Button title="Go to Sign Up" onPress={() => router.push("/signup")} />
      </View>
    </View>
  );
}
