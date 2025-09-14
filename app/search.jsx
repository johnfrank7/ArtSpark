import React, { useState, useEffect } from "react";
import { View, TextInput, FlatList, Image, TouchableOpacity, Text, Button } from "react-native";
import { savePhoto, getUserPhotos, deletePhoto } from "../utils/firestoreHelpers";

export default function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [savedPhotos, setSavedPhotos] = useState([]);

  // Dummy photos for search
  const samplePhotos = [
    { id: "1", url: "https://placekitten.com/200/200" },
    { id: "2", url: "https://placekitten.com/300/200" },
    { id: "3", url: "https://placekitten.com/250/250" },
  ];

  const handleSearch = () => {
    if (query.trim() === "") {
      setResults([]);
      return;
    }
    setResults(samplePhotos.filter(photo => photo.id.includes(query)));
  };

  const handleSave = async (url) => {
    await savePhoto(url);
    loadSavedPhotos();
  };

  const handleDelete = async (id) => {
    await deletePhoto(id);
    loadSavedPhotos();
  };

  const loadSavedPhotos = async () => {
    const photos = await getUserPhotos();
    setSavedPhotos(photos);
  };

  useEffect(() => {
    loadSavedPhotos();
  }, []);

  return (
    <View style={{ flex: 1, padding: 20 }}>
      {/* Search input */}
      <TextInput
        placeholder="Search for reference photos..."
        value={query}
        onChangeText={setQuery}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: "#4CAF50",
          padding: 10,
          borderRadius: 8,
          alignItems: "center",
          marginBottom: 20,
        }}
        onPress={handleSearch}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Search</Text>
      </TouchableOpacity>

      {/* Results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ margin: 5 }}>
            <Image
              source={{ uri: item.url }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 10,
              }}
            />
            <Button title="Save" onPress={() => handleSave(item.url)} />
          </View>
        )}
      />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>Saved Photos</Text>

      {/* Saved photos */}
      <FlatList
        data={savedPhotos}
        keyExtractor={(item) => item.id}
        numColumns={2}
        renderItem={({ item }) => (
          <View style={{ margin: 5 }}>
            <Image
              source={{ uri: item.url }}
              style={{
                width: 150,
                height: 150,
                borderRadius: 10,
              }}
            />
            <Button title="Delete" onPress={() => handleDelete(item.id)} />
          </View>
        )}
      />
    </View>
  );
}
