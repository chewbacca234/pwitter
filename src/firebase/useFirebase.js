import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { firebaseConfig } from "./config";

const providers = {
  google: new GoogleAuthProvider(),
  facebook: new FacebookAuthProvider(),
};

export const useFirebase = () => {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // connexion initiale a Firebase
    const app = initializeApp(firebaseConfig);
    setAuth(getAuth(app));
    setDb(getFirestore(app));
  }, []);

  useEffect(() => {
    if (auth) {
      const unsubscribe = auth.onAuthStateChanged(authUser => {
        setUser(authUser);
      });

      return () => unsubscribe();
    }
  }, [auth]);

  useEffect(() => {
    if (db) {
      const q = query(collection(db, "messages"), orderBy("sentAt"));
      const unsubscribe = onSnapshot(q, data => {
        const messages = data.docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          data.sentAt = data.sentAt.toDate();
          return data;
        });
        setMessages(messages);
      });

      return () => unsubscribe();
    }
  }, [db]);

  const login = async provider =>
    await signInWithPopup(auth, providers[provider.toLowerCase()]);

  const logout = async () => await signOut(auth);

  const addMessage = async content => {
    if (!content || !user || !db) return false;
    const message = {
      content,
      sentAt: new Date(),
      user: {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      },
    };
    await addDoc(collection(db, "messages"), message);
    return true;
  };

  return {
    user,
    login,
    logout,
    addMessage,
    messages,
  };
};
