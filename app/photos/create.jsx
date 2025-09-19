import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as photos from '../../utils/photos';

export default function CreatePhoto() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  const handleSave = async () => {
    if (!title || !url) {
      alert('Fill title and url');
      return;
    }
    await photos.savePhoto({ id: Date.now().toString(), title, url });
    router.back();
  };

  return (
    <View style={styles.container}>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput placeholder="Image URL" value={url} onChangeText={setUrl} style={styles.input} />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, padding:16, backgroundColor:'#fff' },
  input: { borderWidth:1, borderColor:'#ddd', padding:10, borderRadius:6, marginBottom:12 }
});
