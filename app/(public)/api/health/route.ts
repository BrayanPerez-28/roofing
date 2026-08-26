import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await query('SELECT 1');
    return NextResponse.json({ ok: true, message: 'Database connection successful.' }, { status: 200 });
  } catch (error) {
    console.error('Health check failed:', error);
    return NextResponse.json({ ok: false, message: 'Database connection failed.' }, { status: 500 });
  }
}
