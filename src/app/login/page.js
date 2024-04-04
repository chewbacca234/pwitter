'use client';
import React, { useContext, useState, useEffect } from 'react';
import { FirebaseContext } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Button, Modal } from 'antd';
import styles from './page.module.css';
import Image from 'next/image';
import { SignIn, SignUp } from '@/components/Login';

function Login() {
  const router = useRouter();
  const { user, login } = useContext(FirebaseContext);

  const [signUpModalOpen, setSignUpModalOpen] = useState(false);
  const [signInModalOpen, setSignInModalOpen] = useState(false);

  // Redirect to /home if logged in
  useEffect(() => {
    if (user) router.push('/home');
  }, [user]);

  const showSignUpModal = () => {
    setSignUpModalOpen(true);
  };

  const showSignInModal = () => {
    setSignInModalOpen(true);
  };

  const handleCancelSignUp = () => {
    setSignUpModalOpen(false);
  };

  const handleCancelSignIn = () => {
    setSignInModalOpen(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.leftSection}>
        <Image
          src="/images/logo_pwitter_600_600_v2.png"
          alt="Logo"
          width={300}
          height={300}
        />
      </div>
      <div className={styles.rightSection}>
        <Image
          className={styles.miniLogo}
          src="/images/logo_pwitter_50_50.png"
          alt="Logo"
          width={50}
          height={50}
        />
        <div className={styles.loginContent}>
          <h2 className={styles.title}>
            Quelles sont les<br></br>nouvelles ?
          </h2>
          <h3 className={styles.subTitle}>Rejoins Pwitter.</h3>
          <Button
            type="primary"
            shape="round"
            className={styles.btn}
            onClick={showSignUpModal}
          >
            Créer un compte
          </Button>
          <Modal
            onCancel={() => handleCancelSignUp()}
            open={signUpModalOpen}
            footer={null}
            styles={{ content: { backgroundColor: '#15202b' } }}
          >
            <SignUp />
          </Modal>

          <p>Tu as déjà un compte ?</p>
          <Button
            type="primary"
            shape="round"
            className={styles.btn}
            onClick={showSignInModal}
          >
            Connection
          </Button>
          <Modal
            onCancel={() => handleCancelSignIn()}
            open={signInModalOpen}
            footer={null}
            styles={{ content: { backgroundColor: '#15202b' } }}
          >
            <SignIn />
          </Modal>

          <p>Se connecter avec Google</p>
          <Button
            type="primary"
            shape="round"
            className={styles.btn}
            onClick={() => login('google')}
          >
            Google
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
