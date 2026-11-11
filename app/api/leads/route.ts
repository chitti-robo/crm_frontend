import { NextResponse } from 'next/server';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000';
const KEY = process.env.CRM_API_KEY ?? '';

export async function GET() {
  const r = await fetch(`${API}/api/leads`, { headers: { 'x-api-key': KEY }, cache: 'no-store' });
  return NextResponse.json(await r.json(), { status: r.status });
}

export async function POST(req: Request) {
  const r = await fetch(`${API}/api/leads`, {
    method: 'POST',
    headers: { 'x-api-key': KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(await req.json()),
    cache: 'no-store',
  });
  return NextResponse.json(await r.json(), { status: r.status });
}