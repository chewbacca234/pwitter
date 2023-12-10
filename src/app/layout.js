import { Inter } from 'next/font/google';
import './globals.css';
import { ReduxProvider } from '@/redux';
import { useFirebase, FirebaseContext } from '@/firebase';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pwitter',
  description: 'Messagerie instantanée',
};

export default function RootLayout({ children }) {
  const firebase = useFirebase();

  return (
    <html lang="fr">
      <body className={inter.className}>
        <FirebaseContext.Provider value={firebase}>
          <ReduxProvider>{children}</ReduxProvider>
        </FirebaseContext.Provider>
      </body>
    </html>
  );
}
