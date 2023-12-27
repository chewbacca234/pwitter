'use client';
import { Inter } from 'next/font/google';
import './globals.css';
import { useFirebase, FirebaseContext } from '@/firebase';

const inter = Inter({ subsets: ['latin'] });

const metadata = {
  title: 'Pwitter',
  description: 'Messagerie instantanée',
};

export default function RootLayout({ children }) {
  const firebase = useFirebase();

  return (
    <html lang="fr">
      <body className={inter.className}>
        <FirebaseContext.Provider value={firebase}>
          {children}
        </FirebaseContext.Provider>
      </body>
    </html>
  );
}
