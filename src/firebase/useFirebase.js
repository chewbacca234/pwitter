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
  getDocs,
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
  const [trends, setTrends] = useState([]);

  useEffect(() => {
    // Initial connection to Firebase
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
    if (auth && db) {
      const q = query(collection(db, 'pweets'), orderBy('sentAt', 'desc'));
      const unsubscribe = onSnapshot(q, data => {
        const dbPweets = [];
        const dbHashtags = [];
        const dbTrends = [];

        data.docs.map(doc => {
          const pweetData = getPweetData(doc);
          dbPweets.push(pweetData);
          pweetData.hashtags ? dbHashtags.push(...pweetData.hashtags) : null;
          return;
        });

        dbHashtags.forEach(hashtag => {
          const trendIndex = dbTrends.findIndex(
            trend => trend.hashtag === hashtag
          );
          if (trendIndex === -1) {
            dbTrends.push({ hashtag, count: 1 });
          } else {
            dbTrends[trendIndex].count++;
          }
        });

        setPweets(dbPweets);
        setTrends(dbTrends.sort((a, b) => b.count - a.count));
      });

      return () => unsubscribe();
    }
  }, [db, user]);

  function getPweetData(doc) {
    const pweetData = doc.data();
    pweetData.id = doc.id;
    pweetData.sentAt = pweetData.sentAt.toDate();
    return pweetData;
  }

  const login = async provider => {
    try {
      return await signInWithPopup(auth, providers[provider.toLowerCase()]);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
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
        return true;
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(
          `[FIREBASE] email & password signup error ${errorCode} : `,
          errorMessage
        );
        alert(error.message);
      });
  };

  const singinWithEmailAndPassword = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)
      .then(userCredential => {
        // Signed in
        // setAuth({ ...auth, displayName: userCredential.user.displayName });
        console.log('[FIREBASE] user signed in : ', userCredential.user);
      })
      .catch(error => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error(
          `[FIREBASE] email & password signin error ${errorCode} : `,
          errorMessage
        );
        alert(error.message);
      });

  const logout = async () => await signOut(auth);

  const addPweet = async content => {
    if (!content || !user || !db) return false;

    const hashtags = [];

    const filteredHashtags = content
      .split(' ')
      .filter(word => word.startsWith('#') && word.length > 1);
    hashtags.push(...filteredHashtags);

    const message = {
      content,
      sentAt: new Date(),
      user: {
        uid: user.uid,
        photoURL: user.photoURL,
        displayName: user.displayName,
      },
      hashtags,
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

  const getAllHashtagPweets = async hashtag => {
    if (!hashtag || !user || !db) return false;

    const pweets = [];

    const q = query(
      collection(db, 'pweets'),
      where('hashtags', 'array-contains', `#${hashtag}`)
    );

    const pweetsSnapshot = await getDocs(q);
    pweetsSnapshot.forEach(doc => {
      const pweetData = getPweetData(doc);
      console.log("[FIREBASE] hashtag's pweet data", pweetData);
      pweets.push(pweetData);
      return;
    });

    console.log("[FIREBASE] hashtag's pweets", pweets);
    return pweets.sort((a, b) => b.sentAt - a.sentAt);
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
    trends,
    getAllHashtagPweets,
  };
};
