// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { initializeFirestore, persistentMultipleTabManager, persistentLocalCache } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLwr9FpPC3OJEADgagzu7AIdjD6raayAM",
  authDomain: "todojs-efb42.firebaseapp.com",
  projectId: "todojs-efb42",
  storageBucket: "todojs-efb42.appspot.com",
  messagingSenderId: "408147858382",
  appId: "1:408147858382:web:f38230a4de51c69dced19f",
  measurementId: "G-H09T3YXELB"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore con persistencia en caché local (single-tab)
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});

const auth = getAuth(app);

export { db, auth, onAuthStateChanged, signOut };
