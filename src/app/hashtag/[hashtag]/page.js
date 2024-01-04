'use client';
import { Pweet } from '@/components';
import { FirebaseContext } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import styles from './page.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';
import Image from 'next/image';
const defaultAvatar = '/images/avatar.png';

export default function Hashtag({ params }) {
  const router = useRouter();

  const { user, pweets, getAllHashtagPweets, trends, logout } =
    useContext(FirebaseContext);

  const [hashtagPweets, setHashtagPweets] = useState([]);
  console.log('[HASHTAG] user', user);

  // Redirect to /login if not logged in
  useEffect(() => {
    if (!user) router.push('/login');
  }, [user]);

  useEffect(() => {
    (async () => {
      const hashtagPweets = await getAllHashtagPweets(params.hashtag);
      return hashtagPweets;
    })().then(pweets => setHashtagPweets(pweets));
  }, [pweets]);

  console.log("[HASHTAG]hashtag's pweets : ", hashtagPweets);

  // TODO replace api request with pweets filter
  const hashtagPweetsComponents = hashtagPweets
    ? hashtagPweets.map(pweet => {
        return <Pweet key={pweet.id} pweet={pweet} />;
      })
    : [];

  const trendsList = trends.map(trend => {
    return (
      <div
        key={trend.hashtag}
        className={styles.link}
        onClick={() => router.replace(`/hashtag/${trend.hashtag.slice(1)}`)}
      >
        <div className={styles.trendsContainer}>
          <h3 className={styles.hashtag}>{trend.hashtag}</h3>
          <h4 className={styles.nbrTweet}>
            {trend.count} Tweet{trend.count > 1 && 's'}
          </h4>
        </div>
      </div>
    );
  });

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
              router.push('/login');
            }}
            className={styles.button}
          >
            Déconnexion
          </button>
        </div>
      </div>

      <div className={styles.middleSection}>
        <div className={styles.middleSectionHeader}>
          <h2 className={styles.title}>#{params.hashtag}</h2>
          <button onClick={() => router.back()} className={styles.button}>
            <FontAwesomeIcon icon={faChevronLeft} />
            Back
          </button>
        </div>
        <div className={styles.scrollableSection}>
          {hashtagPweetsComponents}
        </div>
      </div>

      <div className={styles.rightSection}>
        <h2 className={styles.title}>Tendances</h2>
        <div className={styles.scrollableSection}>{trendsList}</div>
      </div>
    </div>
  );
}
