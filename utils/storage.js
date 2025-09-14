import AsyncStorage from "@react-native-async-storage/async-storage";

export const saveUser = async (user) => {
  let users = JSON.parse(await AsyncStorage.getItem("USERS")) || [];
  users.push(user);
  await AsyncStorage.setItem("USERS", JSON.stringify(users));
};


export const findUser = async (username, password) => {
  let users = JSON.parse(await AsyncStorage.getItem("USERS")) || [];
  return users.find((u) => u.username === username && u.password === password);
};


export const setCurrentUser = async (user) => {
  await AsyncStorage.setItem("CURRENT_USER", JSON.stringify(user));
};


export const getCurrentUser = async () => {
  const user = await AsyncStorage.getItem("CURRENT_USER");
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  await AsyncStorage.removeItem("CURRENT_USER");
};
