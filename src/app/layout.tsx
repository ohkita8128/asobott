import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'あそボット',
  description: '「いつか行きたいね」を「この日に行こう！」へ。グループの予定調整をお手伝いする執事ボットです。',
  icons: {
    icon: '/icons/butler-icon.png',
    apple: '/icons/butler-icon.png',
  },
  openGraph: {
    title: 'あそボット',
    description: '「いつか行きたいね」を「この日に行こう！」へ',
    images: ['/ogp.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'あそボット',
    description: '「いつか行きたいね」を「この日に行こう！」へ',
    images: ['/ogp.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
