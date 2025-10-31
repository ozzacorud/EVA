import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { userId, filename, contentType } = await req.json();
  if (!userId || !filename || !contentType) return NextResponse.json({ error:'bad request' },{status:400});
  const key = `u_${userId}/${Date.now()}_${filename}`;
  const { data, error } = await supabaseAdmin.storage.from('memories').createSignedUploadUrl(key);
  if (error) return NextResponse.json({ error:error.message },{status:500});
  return NextResponse.json({ url:data.signedUrl, path:key });
}
