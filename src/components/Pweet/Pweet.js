import styles from './Pweet.module.css';

export default function Pweet({ pweet, isOwnMessage }) {
  const isToday = date => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
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
        <h6>{pweet.content}</h6>
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
    </div>
  );
}
