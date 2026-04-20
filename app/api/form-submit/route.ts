import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const required = ['businessName', 'email', 'phone', 'niche', 'city', 'state'];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing: ${field}` },
          { status: 400 }
        );
      }
    }

    console.log('Form submission received:', body);

    return NextResponse.json(
      {
        success: true,
        leadId: 'test-' + Date.now(),
        message: 'Lead received. Report will be emailed shortly.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Form error:', error);
    return NextResponse.json(
      { error: 'Form submission failed' },
      { status: 500 }
    );
  }
}
