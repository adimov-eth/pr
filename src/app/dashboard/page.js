// src/app/dashboard/page.js
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../api/auth/[...nextauth]';
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
    const octokit = getOctokit(session.accessToken);
    const { data } = await octokit.repos.listForAuthenticatedUser();
    repos = data;
  } catch (e) {
    console.error('Error fetching repos:', e);
    error = 'Failed to fetch repositories. Please try again later.';
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {error ? <p className="text-red-500">{error}</p> : <PRListWrapper initialRepos={repos} />}
      <WebhookInstructions />
    </div>
  );
}
