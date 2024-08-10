// src/components/navigation/Navbar.js
'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';

const Navbar = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center">
              PR Review Tool
            </Link>
          </div>
          <div className="flex items-center">
            {status === 'loading' ? (
              <span>Loading...</span>
            ) : session ? (
              <>
                <span className="text-gray-700 mr-4">{session.user.name}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => signIn('github')}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Sign In with GitHub
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;