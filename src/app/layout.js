import { Inter } from 'next/font/google';
import './globals.css';
import { CustomProvider } from '@/redux';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Pwitter',
  description: 'Messagerie instantanée',
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <CustomProvider>{children}</CustomProvider>
      </body>
    </html>
  );
}
