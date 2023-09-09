import { initializeApp } from "firebase/app";

import { getDatabase, ref, set, get, child } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCA1AvHXwpX28UblLFRcmvpjKNjRLMXL3Y",
  authDomain: "mygardenyt-68ab7.firebaseapp.com",
  databaseURL: "https://mygardenyt-68ab7-default-rtdb.firebaseio.com",
  projectId: "mygardenyt-68ab7",
  storageBucket: "mygardenyt-68ab7.appspot.com",
  messagingSenderId: "367174797044",
  appId: "1:367174797044:web:e3c4bb58a9440f83d780a1",
  measurementId: "G-GB3YDP4Q0N",
};

export const _ = initializeApp(firebaseConfig);
const db = getDatabase();
const dbRef = ref(db);

export const saveToken = async (userId: string, token: string) => {
  const values = (await get(child(dbRef, `userTokens/${userId}/`))).val() ?? {};
  const payload = { ...values, token };
  set(ref(db, `userTokens/${userId}/`), payload);
};

export const getToken = async (userId: string) => {
  const values = (await get(child(dbRef, `userTokens/${userId}`))).val();
  return values ?? {};
};

export const saveSample = async (moistureLevel: number, userId: string) => {
  set(ref(db, `users/${userId}/${Date.now().toString()}`), {
    moisture: moistureLevel,
  });
};

export const getSamples = async (userId: string) => {
  const values = (await get(child(dbRef, `users/${userId}/`))).val();
  const moistureReadings = Object.values(values) as { moisture: number }[];
  const readings = moistureReadings.map((reading) => reading.moisture);

  return {
    currentMoistureLevel: readings[readings.length - 1],
    previousMoistureLevels: readings,
  };
};
