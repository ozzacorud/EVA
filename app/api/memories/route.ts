import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const s=req.nextUrl.searchParams;const userId=s.get('userId');if(!userId)return NextResponse.json({error:'userId required'},{status:400});
  const { data, error } = await supabaseAdmin.from('memories').select('*').eq('user_id',userId).order('created_at',{ascending:false});
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const b=await req.json();const { userId,type,storageUrl,privacy='private',caption }=b;
  if(!userId||!type||!storageUrl)return NextResponse.json({error:'bad request'},{status:400});
  const { data,error }=await supabaseAdmin.from('memories').insert({user_id:userId,type,storage_path:storageUrl,privacy,caption}).select().single();
  if(error)return NextResponse.json({error:error.message},{status:500});
  return NextResponse.json(data);
}
