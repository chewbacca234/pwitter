import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import styles from './Pweet.module.css';
import { FirebaseContext } from '@/firebase';
import { useContext } from 'react';
import { Popconfirm } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
const defaultAvatar = '/images/avatar.png';

export default function Pweet({ pweet }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, removePweet, addRemoveLike } = useContext(FirebaseContext);

  const isLiked = pweet.likes?.some(e => e === user?.uid);
  const isOwnMessage = pweet.user.uid === user?.uid;

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

  // console.log('[PWEET] router pathname', pathname);
  const formattedContent = pweet.content.split(' ').map((word, i) => {
    if (word.startsWith('#') && word.length > 1) {
      return (
        <span
          key={i}
          className={styles.hashtag}
          onClick={() =>
            pathname.includes('hashtag')
              ? router.replace(`/hashtag/${word.slice(1)}`)
              : router.push(`/hashtag/${word.slice(1)}`)
          }
        >
          {word + ' '}
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
          src={pweet.user.photoURL || defaultAvatar }
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
                pweet?.sentAt.getHours()
              )}h
          ${String(pweet?.sentAt.getMinutes()).padStart(2, 0)}`}
        </p>
      </div>
      <div className={styles.iconsSection}>
        <div className={styles.likeBtn}>
          <FontAwesomeIcon
            icon={faThumbsUp}
            onClick={handleLike}
            style={likeStyle}
          />
        </div>
        {/* <span style={likeStyle}>{props.likes.length}</span> */}

        {isOwnMessage ? (
          <Popconfirm
            title="Supprimer le message"
            description="Etes-vous sûr de vouloir supprimer ce message ?"
            onConfirm={handleDelete}
            onCancel={e => console.log('[PWEET] user canceled delete message')}
            okText="Oui"
            cancelText="Non"
          >
            <div className={styles.deleteBtn}>
              <FontAwesomeIcon icon={faTrashCan} />
            </div>
          </Popconfirm>
        ) : null}
      </div>
    </div>
  );
}
