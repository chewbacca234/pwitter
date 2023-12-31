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
  updateDoc,
  deleteDoc,
  collection,
  doc,
  query,
  onSnapshot,
  orderBy,
  getDoc,
  arrayUnion,
  arrayRemove,
  where,
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
      const q = query(collection(db, 'pweets'), orderBy('sentAt', 'desc'));
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

  const removePweet = async pweetId => {
    if (!pweetId || !user || !db) return false;

    await deleteDoc(doc(db, 'pweets', pweetId));
    return true;
  };

  const addRemoveLike = async pweetId => {
    if (!pweetId || !user || !db) return false;

    const pweetRef = doc(db, 'pweets', pweetId);
    // console.log('[FIREBASE] pweetRef', pweetRef);

    const pweetSnapshot = await getDoc(pweetRef);
    // console.log('[FIREBASE] pweet snapshot', pweetSnapshot);

    let pweetData;
    if (pweetSnapshot.exists()) {
      pweetData = pweetSnapshot.data();
      console.log('[FIREBASE] pweet data:', pweetData);
    } else {
      console.log('[FIREBASE] Pweet not found');
      return false;
    }

    const isLiked = pweetData.likes?.some(e => e === user.uid);
    console.log('[FIREBASE] user already liked message ? ', isLiked);

    if (isLiked) {
      await updateDoc(pweetRef, {
        likes: arrayRemove(user.uid),
      });
      console.log('[FIREBASE] like removed');
    } else {
      await updateDoc(pweetRef, {
        likes: arrayUnion(user.uid),
      });
      console.log('[FIREBASE] like added');
    }
    return true;
  };

  return {
    user,
    login,
    singupWithEmailAndPassword,
    singinWithEmailAndPassword,
    logout,
    addPweet,
    removePweet,
    addRemoveLike,
    pweets,
  };
};
