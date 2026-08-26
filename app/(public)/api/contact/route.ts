import { NextResponse } from 'next/server';
import { execute } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const fullName = `${body.firstName || ''} ${body.lastName || ''}`.trim();
    const email = body.email || null;
    const phone = body.phone || '';
    const address = body.address || 'No provided';
    const serviceInterest = body.inquiryType || 'general';
    const description = body.message || null;

    await execute(
      `INSERT INTO quote_request (full_name, email, phone, address, service_interest, description, status) VALUES (?, ?, ?, ?, ?, ?, 'pending')`,
      [fullName, email, phone, address, serviceInterest, description]
    );

    return NextResponse.json({ success: true, message: 'Request saved successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json({ success: false, message: 'Failed to save request.' }, { status: 500 });
  }
}
