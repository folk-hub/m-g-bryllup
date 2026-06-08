import './globals.css';

export const metadata = {
  title: 'Miriam & Gjermund — 19. juni 2027',
  description: 'Bryllupsside for Miriam & Gjermund. Lørdag 19. juni 2027 i Kristiansand. Praktisk informasjon, program, kleskode og RSVP.',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="no">
      <body>{children}</body>
    </html>
  );
}
