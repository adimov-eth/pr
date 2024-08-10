import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getOctokit } from '@/lib/github';
// import kv from '@/lib/kv';
import { handleApiError } from '@/utils/apiUtils';

export async function GET(request) {
    const headers = new Headers({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
  
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { headers });
    }
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
        }
    
        const { searchParams } = new URL(request.url);
        const repo = searchParams.get('repo');
    
        if (!repo) {
          return NextResponse.json({ error: 'Repository name is required' }, { status: 400, headers });
        }
    
        const cacheKey = `prs:${repo}`;
        // const cachedData = await kv.get(cacheKey);
    
        // if (cachedData) {
        //   return NextResponse.json(cachedData, { headers });
        // }
    
        const [owner, repoName] = repo.split('/');
        const octokit = getOctokit(session.accessToken);
        const { data } = await octokit.pulls.list({
          owner,
          repo: repoName,
          state: 'open',
        });
    
        // Cache the result for 5 minutes
        // await kv.set(cacheKey, data, { ex: 300 });
    
        return NextResponse.json(data, { headers });
      } catch (error) {
        return handleApiError(error, headers);
      }
    }
