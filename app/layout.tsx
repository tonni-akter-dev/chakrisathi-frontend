import type { Metadata } from 'next';
import { Inter, Hind_Siliguri } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/utils/AppContext';
import { ToastContainer } from 'react-toastify';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'সোনার হরিণ — সরকারি চাকরির সার্কুলার ও আবেদন সহায়তা',
  description: 'বাংলাদেশের সব চলমান সরকারি চাকরির সার্কুলার এক জায়গায়।',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${inter.variable} ${hind.variable}`}>
      <body className="font-hind bg-slate-50 text-slate-900 antialiased">
        <AppProvider>
          {children}

          <ToastContainer
            position="bottom-center"
            autoClose={3000}
            hideProgressBar={true}
            closeOnClick
            theme="dark"
            toastStyle={{ borderRadius: '9999px', fontWeight: '600' }}
          />
        </AppProvider>
      </body>
    </html>
  );
}