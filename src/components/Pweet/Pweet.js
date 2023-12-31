import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import styles from './Pweet.module.css';
import { FirebaseContext } from '@/firebase';
import { useContext } from 'react';

export default function Pweet({ pweet, isOwnMessage, isLiked }) {
  const { removePweet, addRemoveLike } = useContext(FirebaseContext);

  const isToday = date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  let likeStyle = { color: 'fff' };
  if (isLiked) likeStyle = { color: '#409bf1' };

  const formattedContent = pweet.content.split(' ').map((word, i) => {
    if (word.startsWith('#') && word.length > 1) {
      return (
        <span key={i} style={{ fontWeight: 'bold' }}>
          <Link href={`/hashtag/${word.slice(1)}`}>{word}</Link>{' '}
        </span>
      );
    }
    return word + ' ';
  });

  const handleLike = async () => {
    await addRemoveLike(pweet.id);
  };

  const handleDelete = async () => {
    await removePweet(pweet.id);
  };

  return (
    <div
      className={`${styles.message} ${
        isOwnMessage ? styles.self : styles.other
      }`}
    >
      <div className={styles.header}>
        <img
          src={pweet?.user.photoURL}
          alt={pweet?.user.displayName}
          className={styles.avatar}
        />
        <p className={styles.name}>
          {pweet.user.displayName?.split(' ')[0] || ''}
        </p>
      </div>
      <div className={styles.content}>
        <h6>{formattedContent}</h6>
        <p className={styles.time}>
          {isToday(pweet?.sentAt)
            ? `${String(pweet?.sentAt.getHours())}h
          ${String(pweet?.sentAt.getMinutes()).padStart(2, 0)}`
            : `Le ${String(pweet?.sentAt.getDate())}/${String(
                pweet?.sentAt.getMonth()
              )}/${String(pweet?.sentAt.getFullYear())} à ${String(
                pweet?.sentAt.getDate()
              )}h
          ${String(pweet?.sentAt.getMinutes()).padStart(2, 0)}`}
        </p>
      </div>
      <div className={styles.iconsSection}>
        <FontAwesomeIcon
          icon={faThumbsUp}
          onClick={handleLike}
          className={styles.like}
          style={likeStyle}
        />
        {/* <span style={likeStyle}>{props.likes.length}</span> */}

        {isOwnMessage ? (
          <FontAwesomeIcon
            icon={faTrashCan}
            onClick={handleDelete}
            className={styles.delete}
          />
        ) : null}
      </div>
    </div>
  );
}
