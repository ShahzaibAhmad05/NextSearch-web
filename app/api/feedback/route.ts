// app/api/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8080';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, email, type } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { message: 'Message is required' },
        { status: 400 }
      );
    }

    if (type === 'replyable' && (!email || typeof email !== 'string')) {
      return NextResponse.json(
        { message: 'Email is required for replyable feedback' },
        { status: 400 }
      );
    }

    // Prepare feedback payload
    const feedbackData = {
      message,
      email: type === 'replyable' ? email : null,
      type,
      timestamp: new Date().toISOString(),
    };

    // Send feedback to backend API
    const response = await fetch(`${API_BASE}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(feedbackData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Failed to send feedback' }));
      throw new Error(error.message || 'Failed to send feedback');
    }

    return NextResponse.json(
      { 
        message: 'Feedback sent successfully'
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending feedback:', error);
    return NextResponse.json(
      { 
        message: 'Failed to send feedback',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
