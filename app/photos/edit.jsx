import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { useRouter, useSearchParams } from 'expo-router';
import * as photos from '../../utils/photos';

export default function EditPhoto() {
  const { id } = useSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    (async () => {
      const list = await photos.getPhotos();
      const p = list.find(x => x.id === id);
      if (!p) {
        alert('Photo not found');
        router.back();
        return;
      }
      setTitle(p.title);
      setUrl(p.url);
    })();
  }, [id]);

  const handleUpdate = async () => {
    await photos.updatePhoto(id, { title, url });
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Edit Photo</Text>
      <TextInput value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput value={url} onChangeText={setUrl} style={styles.input} />
      <Button title="Update" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  label: { fontSize:18, fontWeight:'600', marginBottom:12 },
  input: { borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:6, marginBottom:12 }
});
