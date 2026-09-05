import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ProjectForge - AI Project Generator',
  description: 'Turn your skills into a final-year masterpiece.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}