import styles from './Pweet.module.css';

export default function Pweet({ pweet, isOwnMessage }) {
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
      <div>
        <h6>{pweet.content}</h6>
        <p>
          {String(pweet?.sentAt.getHours())}h
          {String(pweet?.sentAt.getMinutes()).padStart(2, 0)}
        </p>
      </div>
    </div>
  );
}
