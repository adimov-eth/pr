// src/app/layout.js
import '@/app/globals.css';
import Navbar from '@/components/navigation/Navbar';

export const metadata = {
  title: 'LLM-based PR Review Tool',
  description: 'AI-powered service that reviews pull requests and evaluates code contributions',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
