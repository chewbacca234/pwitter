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
    name: 'username',
    placeholder: 'username',
  },
  {
    name: 'password',
    type: 'password',
    placeholder: 'password',
  },
  {
    name: 'confirmPassword',
    type: 'password',
    placeholder: 'confirm Password',
  },
];

export default function SignUp() {
  const { singupWithEmailAndPassword } = useContext(FirebaseContext);

  const { formData, handleChange, handleSubmit } = useForm({
    onSubmit: e => {
      console.log('[SIGNUP] formdata', formData);
      if (formData.password !== formData.confirmPassword) {
        // TODO Gestion de l'erreur de saisie
        return;
      }
      return singupWithEmailAndPassword(formData);
    },
  });

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <Image
        src="/images/logo_pwitter_50_50.png"
        alt="Logo"
        width={50}
        height={50}
      />
      <h3 className={styles.title}>Crée ton compte Pwitter</h3>
      {fields.map(field => (
        <input
          key={field.name}
          className={styles.input}
          {...field}
          onChange={handleChange}
        />
      ))}
      <button className={styles.button} type="submit">
        Envoyer
      </button>
    </form>
  );
}
