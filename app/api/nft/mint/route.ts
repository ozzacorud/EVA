import { NextRequest, NextResponse } from 'next/server';
import { Web3Storage, File } from 'web3.storage';

export async function POST(req: NextRequest) {
  const { memoryId, metadata } = await req.json();
  const token = process.env.WEB3STORAGE_TOKEN!;
  if (!token) return NextResponse.json({ error: 'WEB3STORAGE_TOKEN missing' }, { status: 500 });
  const w3 = new Web3Storage({ token });
  const file = new File([JSON.stringify(metadata)], `memory-${memoryId}.json`, { type: 'application/json' });
  const cid = await w3.put([file], { wrapWithDirectory: false });
  return NextResponse.json({ tokenUri: `ipfs://${cid}` });
}
