'use client';
import { useEffect, useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { FirebaseContext } from '@/firebase';

function Landing() {
  const router = useRouter();
  const { user } = useContext(FirebaseContext);

  // Redirect to /login if not logged in & to /home if logged in
  useEffect(() => {
    user ? router.push('/home') : router.push('/login');
  }, [user]);

  return <></>;
}

export default Landing;
