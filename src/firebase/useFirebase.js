'use client';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  updateProfile,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  EmailAuthProvider,
  signOut,
} from 'firebase/auth';
import {
  getFirestore,
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { firebaseConfig } from './config';

const providers = {
  google: new GoogleAuthProvider(),
  email: new EmailAuthProvider(),
};

export const useFirebase = () => {
  const [auth, setAuth] = useState(null);
  const [db, setDb] = useState(null);
  const [user, setUser] = useState(null);
  const [pweets, setPweets] = useState([]);

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
      const q = query(collection(db, 'pweets'), orderBy('sentAt'));
      const unsubscribe = onSnapshot(q, data => {
        const pweets = data.docs.map(doc => {
          const data = doc.data();
          data.id = doc.id;
          data.sentAt = data.sentAt.toDate();
          return data;
        });
        setPweets(pweets);
      });

      return () => unsubscribe();
    }
  }, [db]);

  const login = async provider => {
    try {
      return await signInWithPopup(auth, providers[provider.toLowerCase()]);
    } catch (error) {
      console.log(error.message);
    }
  };

  const singupWithEmailAndPassword = formData => {
    const { email, password, username } = formData;

    createUserWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed up
        updateProfile(auth.currentUser, {
          displayName: username,
          photoURL: '/images/avatar.png',
        });
        console.log('[FIREBASE] user signed up : ', userCredential.user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(
          `[FIREBASE] email & password signup error ${errorCode} : `,
          errorMessage
        );
      });
  };

  const singinWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        setAuth({ ...auth, displayName });
        console.log('[FIREBASE] user signed in : ', userCredential.user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(
          `[FIREBASE] email & password signin error ${errorCode} : `,
          errorMessage
        );
      });

  const logout = async () => await signOut(auth);

  const addPweet = async content => {
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
    await addDoc(collection(db, 'pweets'), message);
    return true;
  };

  return {
    user,
    login,
    singupWithEmailAndPassword,
    singinWithEmailAndPassword,
    logout,
    addPweet,
    pweets,
  };
};
