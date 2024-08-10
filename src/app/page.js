// src/app/page.js
import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to PR Review Tool</h1>
      <p className="mb-8">Analyze your pull requests with AI-powered insights</p>
      {session ? (
        <Link href="/dashboard" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
          Go to Dashboard
        </Link>
      ) : (
        <p>Sign in to get started!</p>
      )}
    </div>
  );
}