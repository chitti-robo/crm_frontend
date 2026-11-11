import type { Metadata } from 'next';
import { Bricolage_Grotesque, Public_Sans } from 'next/font/google';
import './globals.css';
import { CRMProvider } from '@/lib/store';

const hd = Bricolage_Grotesque({ subsets: ['latin'], weight: ['500', '700'], variable: '--font-hd' });
const bd = Public_Sans({ subsets: ['latin'], variable: '--font-bd' });
export const metadata: Metadata = { title: 'L&L Marketing CRM' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${hd.variable} ${bd.variable}`}>
      <body><CRMProvider>{children}</CRMProvider></body>
    </html>
  );
}
