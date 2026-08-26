import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await query(`SELECT id, name, email, created_at AS createdAt FROM administrator ORDER BY created_at DESC`);
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Admin GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch administrators.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await execute(
      `INSERT INTO administrator (name, email, password) VALUES (?, ?, ?)`,
      [body.name, body.email, body.password]
    );

    return NextResponse.json({ success: true, message: 'Administrator created.' }, { status: 200 });
  } catch (error) {
    console.error('Admin POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to create administrator.' }, { status: 500 });
  }
}
