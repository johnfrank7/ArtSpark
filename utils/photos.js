import AsyncStorage from "@react-native-async-storage/async-storage";

const PHOTO_KEY = "photos";

export async function getPhotos() {
  const json = await AsyncStorage.getItem(PHOTO_KEY);
  return json ? JSON.parse(json) : [];
}

export async function savePhoto(photo) {
  const photos = await getPhotos();
  photos.push(photo);
  await AsyncStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
}

export async function deletePhoto(id) {
  let photos = await getPhotos();
  photos = photos.filter((p) => p.id !== id);
  await AsyncStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
}

export async function updatePhoto(id, newData) {
  let photos = await getPhotos();
  photos = photos.map((p) => (p.id === id ? { ...p, ...newData } : p));
  await AsyncStorage.setItem(PHOTO_KEY, JSON.stringify(photos));
}
