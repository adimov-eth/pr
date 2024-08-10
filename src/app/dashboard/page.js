import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]/route';
import PRListWrapper from '@/components/PRListWrapper';
import WebhookInstructions from '@/components/WebhookInstructions';
import { getOctokit } from '@/lib/github';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return <div>Please sign in to access the dashboard.</div>;
  }

  let repos = [];
  let error = null;

  try {
    if (!session.accessToken) {
      throw new Error('No GitHub access token found in session. Please try signing out and signing in again.');
    }
    
    const octokit = getOctokit(session.accessToken);
    const { data } = await octokit.repos.listForAuthenticatedUser();
    repos = data;
  } catch (e) {
    console.error('Error fetching repos:', e);
    error = e.message || 'Failed to fetch repositories. Please try again later.';
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {error ? (
        <div>
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.href = '/api/auth/signout'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign Out and Try Again
          </button>
        </div>
      ) : (
        <PRListWrapper initialRepos={repos} />
      )}
      <WebhookInstructions />
    </div>
  );
}