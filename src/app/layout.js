// src/app/layout.js
import '@/app/globals.css';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]/route";
import SessionProvider from "@/components/SessionProvider";
import Navbar from '@/components/navigation/Navbar';

export const metadata = {
  title: 'LLM-based PR Review Tool',
  description: 'AI-powered service that reviews pull requests and evaluates code contributions',
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);

  console.log('RootLayout - Session:', session);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[rgb(var(--background-rgb))] text-[rgb(var(--foreground-rgb))]">
        <SessionProvider session={session}>
          <Navbar />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </SessionProvider>
      </body>
    </html>
  );
}