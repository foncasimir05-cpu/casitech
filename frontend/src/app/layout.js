import './globals.css';

export const metadata = { title: 'Casitech — Electronics Marketplace', description: 'Buy the latest electronics' };

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}