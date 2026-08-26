import { NextResponse } from 'next/server';
import { execute, query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rows = await query(
      `SELECT id, author_name AS authorName, rating, body, is_approved AS isApproved, created_at AS createdAt FROM review WHERE is_approved = TRUE ORDER BY created_at DESC`
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error('Reviews GET error:', error);
    return NextResponse.json({ success: false, message: 'Failed to fetch reviews.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    await execute(
      `INSERT INTO review (author_name, rating, body, is_approved) VALUES (?, ?, ?, FALSE)`,
      [body.name, body.rating, body.comment]
    );

    return NextResponse.json({ success: true, message: 'Review saved successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Reviews POST error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save review.' }, { status: 500 });
  }
}
