import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';
import { getOctokit } from '@/lib/github';
import openai from '@/lib/openai';
import { supabase } from '@/lib/supabase';
import { handleApiError } from '@/utils/apiUtils';
import { z } from 'zod';

const analyzeSchema = z.object({
  repoName: z.string(),
  prNumber: z.number().int().positive(),
});

export async function POST(request) {
  try {

    const headers = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        });

    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { headers });
        }

  
    

    // try {
    //   await limiter.check(NextResponse, 10, 'ANALYZE_TOKEN'); // 10 requests per minute
    // } catch {
    //   return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
    // }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { repoName, prNumber } = analyzeSchema.parse(body);

    const cacheKey = `analysis:${repoName}:${prNumber}`;
    // const cachedAnalysis = await kv.get(cacheKey);

    // if (cachedAnalysis) {
    //   return NextResponse.json({ analysisResult: cachedAnalysis });
    // }

    // Fetch PR details from GitHub
    const octokit = getOctokit(session.accessToken);
    const [owner, repo] = repoName.split('/');
    const { data: pr } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
    });

    // Fetch the PR diff
    const { data: diff } = await octokit.pulls.get({
      owner,
      repo,
      pull_number: prNumber,
      mediaType: {
        format: 'diff',
      },
    });

    const prompt = `Analyze the following pull request:
    Title: ${pr.title}
    Description: ${pr.body}
    Files changed:
    ${diff}

    Provide a brief summary of changes (2-3 sentences), estimate the effort (Low/Medium/High), potential impact on the project (Low/Medium/High), and highlight any red flags or areas needing attention.`;

    // Send to OpenAI for analysis
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const analysisResult = completion.choices[0].message.content;

    console.log('Attempting to save analysis result:', { repoName, prNumber, analysisResult });

     // First, try to update the existing record
     const { data, error } = await supabase
     .from('pull_requests')
     .update({
       analysis_result: analysisResult,
       analyzed_at: new Date().toISOString(),
     })
     .match({ repo_name: repoName, pr_number: prNumber });

   if (error) {
     console.error('Error updating analysis result:', error);
     return NextResponse.json({ error: 'Failed to store analysis result' }, { status: 500 });
   }

   // If no rows were affected by the update, insert a new record
   if (data && data.length === 0) {
     console.log('No existing record found. Inserting new record.');
     const { data: insertData, error: insertError } = await supabase
       .from('pull_requests')
       .insert({
         repo_name: repoName,
         pr_number: prNumber,
         analysis_result: analysisResult,
         analyzed_at: new Date().toISOString(),
       });

     if (insertError) {
       console.error('Error inserting new analysis result:', insertError);
       return NextResponse.json({ error: 'Failed to store analysis result' }, { status: 500 });
     }
   }

   console.log('Analysis result saved successfully');

   return NextResponse.json({ analysisResult });
 } catch (error) {
   return handleApiError(NextResponse, error);
 }
}
