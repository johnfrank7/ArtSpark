import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";
import { savePhoto } from "../../utils/photos";
import { useRouter } from "expo-router";
import { v4 as uuidv4 } from "uuid";

export default function CreatePhoto() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  const handleSave = async () => {
    await savePhoto({ id: uuidv4(), title, url });
    router.back();
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Photo Title"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <TextInput
        placeholder="Photo URL"
        value={url}
        onChangeText={setUrl}
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}
