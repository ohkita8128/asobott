import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://asobott.vercel.app'),
  title: {
    default: 'あそボット',
    template: '%s | あそボット',
  },
  description: '「いつか行きたいね」を「この日に行こう！」へ。LINEグループの予定調整をお手伝いするBot。行きたい場所の共有・日程調整・参加確認まで、LINEだけで完結します。',
  icons: {
    icon: '/icons/butler-icon.png',
    apple: '/icons/butler-icon.png',
  },
  openGraph: {
    title: 'あそボット - LINEグループの予定調整をもっと簡単に',
    description: '「いつか行きたいね」を「この日に行こう！」へ。行きたい場所の共有から日程調整まで、LINEだけで完結。',
    images: [{ url: '/ogp.png', width: 1200, height: 630, alt: 'あそボット' }],
    type: 'website',
    locale: 'ja_JP',
    siteName: 'あそボット',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'あそボット - LINEグループの予定調整をもっと簡単に',
    description: '「いつか行きたいね」を「この日に行こう！」へ。行きたい場所の共有から日程調整まで、LINEだけで完結。',
    images: ['/ogp.png'],
  },
  verification: {
    google: 'w9pCpDv4EY1dLuFa5UBBXQHR0nLXM0IPox73xkvT0go',
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
