import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDrUzrUpNzDB8UiK80f0UzX2ppkgZjxWGg",
  authDomain: "beanpulze-54047.firebaseapp.com",
  projectId: "beanpulze-54047",
  storageBucket: "beanpulze-54047.appspot.com",
  messagingSenderId: "1047264981366",
  appId: "1:1047264981366:web:88d57564139856a4b44a57"
};

// Prevent duplicate app init
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Always use initializeAuth() for React Native to enable persistence
let auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch (error) {
  auth = getAuth(app);
}

const db = getFirestore(app);

export { auth, db };
