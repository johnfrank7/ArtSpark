import React, { useEffect, useState } from "react";
import { View, TextInput, Button } from "react-native";
import { getPhotos, updatePhoto } from "../../utils/photos";
import { useRouter, useSearchParams } from "expo-router";

export default function EditPhoto() {
  const { id } = useSearchParams();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const router = useRouter();

  useEffect(() => {
    const loadPhoto = async () => {
      const photos = await getPhotos();
      const photo = photos.find((p) => p.id === id);
      if (photo) {
        setTitle(photo.title);
        setUrl(photo.url);
      }
    };
    loadPhoto();
  }, [id]);

  const handleUpdate = async () => {
    await updatePhoto(id, { title, url });
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
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}
