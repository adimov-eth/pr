// src/app/api/webhook/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

const verifySignature = (signature, body) => {
  const hmac = crypto.createHmac('sha256', process.env.WEBHOOK_SECRET);
  const expectedSignature = `sha256=${hmac.update(body).digest('hex')}`;
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
};

export async function POST(request) {
  const payload = await request.text();
  const signature = request.headers.get('X-Hub-Signature-256');

  if (!verifySignature(signature, payload)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  const jsonPayload = JSON.parse(payload);

  if (jsonPayload.action === 'opened' || jsonPayload.action === 'synchronize') {
    const pr = jsonPayload.pull_request;
    const { data, error } = await supabase.from('pull_requests').upsert(
      {
        repo_name: jsonPayload.repository.full_name,
        pr_number: pr.number,
        title: pr.title,
        description: pr.body,
        author: pr.user.login,
        created_at: pr.created_at,
        updated_at: new Date().toISOString(),
      },
      {
        onConflict: 'repo_name,pr_number',
      }
    );

    if (error) {
      console.error('Error inserting/updating pull request:', error);
      return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ message: 'Webhook processed successfully' });
}
