'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseContext } from '@/firebase';
import Link from 'next/link';
import Image from 'next/image';
import { Pweet } from '@/components';
// import Trends from './Trends';
import styles from './page.module.css';
const defaultAvatar = '/images/avatar.png';

function Home() {
  const router = useRouter();
  const { user, pweets, addPweet, logout } = useContext(FirebaseContext);
  const [newPweet, setNewPweet] = useState('');

  console.log('[HOME] user', user);

  // Redirect to /login if not logged in
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  console.log('[HOME] pweets', pweets);
  const lastPweets = pweets
    // .sort((a, b) => b.sentAt - a.sentAt)
    .map(pweet => {
      const isLiked = pweet.likes?.some(e => e === user?.uid);
      return (
        <Pweet
          key={pweet.id}
          pweet={pweet}
          isLiked={isLiked}
          isOwnMessage={pweet.user.uid === user?.uid}
        />
      );
    });

  const handleInputChange = e => {
    if (
      newPweet.length < 280 ||
      e.nativeEvent.inputType === 'deleteContentBackward'
    ) {
      setNewPweet(e.target.value);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const res = await addPweet(newPweet);
    if (res) setNewPweet('');
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <div>
          <Link href="/">
            <Image
              src="/images/logo_pwitter_50_50.png"
              alt="Logo"
              width={50}
              height={50}
              className={styles.logo}
            />
          </Link>
        </div>
        <div>
          <div className={styles.userSection}>
            <div>
              <Image
                src={user?.photoURL || defaultAvatar}
                alt="Avatar"
                width={46}
                height={46}
                className={styles.avatar}
              />
            </div>
            {user ? (
              <div className={styles.userInfo}>
                {/* <p className={styles.name}>{user.firstName}</p> */}
                <p className={styles.username}>@{user.displayName}</p>
              </div>
            ) : null}
          </div>
          <button
            onClick={() => {
              logout();
            }}
            className={styles.logout}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className={styles.middleSection}>
        <h2 className={styles.title}>Acceuil</h2>
        <div className={styles.createSection}>
          <textarea
            type="text"
            placeholder="Quoi de neuf ?"
            className={styles.input}
            onChange={handleInputChange}
            value={newPweet}
          />
          <div className={styles.validatePweet}>
            <p>{newPweet.length}/280</p>
            <button className={styles.button} onClick={handleSubmit}>
              Pweet
            </button>
          </div>
        </div>
        {lastPweets}
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.title}>Tendances</h2>
        {/* <Trends /> */}
      </div>
    </div>
  );
}

export default Home;
