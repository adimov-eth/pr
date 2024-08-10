import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { getOctokit } from '@/lib/github';
import kv from '@/lib/kv';

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  
    const { searchParams } = new URL(request.url);
    const repo = searchParams.get('repo');
  
    if (!repo) {
      return NextResponse.json({ error: 'Repository name is required' }, { status: 400 });
    }
  
    const cacheKey = `prs:${repo}`;
    const cachedData = await kv.get(cacheKey);
  
    if (cachedData) {
      return NextResponse.json(cachedData);
    }
  
    try {
      const [owner, repoName] = repo.split('/');
      const octokit = getOctokit(session.accessToken);
      const { data } = await octokit.pulls.list({
        owner,
        repo: repoName,
        state: 'open',
      });
  
      // Cache the result for 5 minutes
      await kv.set(cacheKey, data, { ex: 300 });
  
      return NextResponse.json(data);
    } catch (error) {
      console.error('Error fetching PRs:', error);
      return NextResponse.json({ error: 'Failed to fetch pull requests' }, { status: 500 });
    }
  }
