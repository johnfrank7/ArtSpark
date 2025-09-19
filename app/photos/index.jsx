import { useEffect, useState } from "react";
import { View, Text, Button, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../../utils/firebaseConfig";

export default function Photos() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        setUser(null);
        router.replace("/login");
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {user ? (
        <>
          <Text className="text-xl font-bold">Welcome to Photos, {user.email}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>You are not logged in</Text>
          <Button title="Go to Login" onPress={() => router.replace("/login")} />
        </>
      )}
    </View>
  );
}
