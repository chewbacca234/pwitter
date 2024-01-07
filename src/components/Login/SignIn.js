import { useForm } from '@/hooks';
import Image from 'next/image';
import styles from './login.module.css';
import { useContext } from 'react';
import { FirebaseContext } from '@/firebase';

const fields = [
  {
    name: 'email',
    type: 'email',
    placeholder: 'email',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'password',
  },
];

export default function SignIn() {
  const { singinWithEmailAndPassword } = useContext(FirebaseContext);

  const { formData, handleChange, handleSubmit } = useForm({
    onSubmit: e =>
      singinWithEmailAndPassword(formData.email, formData.password),
  });

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Image
        src="/images/logo_pwitter_50_50.png"
        alt="Logo"
        width={50}
        height={50}
      />
      <h3 className={styles.title}>Connecte-toi</h3>
      {fields.map(field => (
        <input
          key={field.name}
          className={styles.input}
          {...field}
          onChange={handleChange}
        />
      ))}
      <button className={styles.button} type="submit">
        Connection
      </button>
    </form>
  );
}
