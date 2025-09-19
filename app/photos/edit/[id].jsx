import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { updatePhoto, getPhotoById } from '../../../utils/firestoreHelpers';

export default function EditPhoto() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadPhoto();
  }, [id]);

  const loadPhoto = async () => {
    try {
      setLoading(true);
      const photo = await getPhotoById(id);
      if (!photo) {
        Alert.alert('Error', 'Photo not found');
        router.back();
        return;
      }
      setTitle(photo.title || '');
      setUrl(photo.url || '');
    } catch (error) {
      console.error('Error loading photo:', error);
      Alert.alert('Error', 'Failed to load photo');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }
    
    try {
      setUpdating(true);
      await updatePhoto(id, { title: title.trim(), url });
      Alert.alert('Success', 'Photo updated successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating photo:', error);
      Alert.alert('Error', 'Failed to update photo');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading photo...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Edit Photo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Title *</Text>
          <TextInput 
            value={title} 
            onChangeText={setTitle} 
            style={styles.input}
            placeholder="Enter photo title"
            maxLength={100}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput 
            value={url} 
            onChangeText={setUrl} 
            style={[styles.input, styles.urlInput]}
            placeholder="Image URL (read-only)"
            editable={false}
          />
        </View>

        <TouchableOpacity 
          style={[styles.updateButton, updating && styles.updateButtonDisabled]} 
          onPress={handleUpdate}
          disabled={updating}
        >
          <Text style={styles.updateButtonText}>
            {updating ? 'Updating...' : 'Update Photo'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFE4B5' 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    borderBottomWidth: 0,
  },
  backButton: {
    padding: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backIcon: {
    fontSize: 22,
    color: '#8B4513'
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#8B4513',
    fontStyle: 'italic',
    textShadowColor: 'rgba(255,255,255,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  placeholder: {
    width: 36
  },
  content: {
    flex: 1,
    padding: 20
  },
  inputGroup: {
    marginBottom: 20
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8
  },
  input: {
    borderWidth: 1,
    borderColor: '#dee2e6',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#495057'
  },
  urlInput: {
    backgroundColor: '#f8f9fa',
    color: '#6c757d'
  },
  updateButton: {
    backgroundColor: '#6B8E23',
    paddingVertical: 16,
    paddingHorizontal: 28,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  updateButtonDisabled: {
    backgroundColor: '#6c757d'
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  loadingText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginTop: 40
  }
});
