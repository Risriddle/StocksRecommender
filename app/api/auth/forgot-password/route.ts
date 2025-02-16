import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import {User} from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    // Check if user exists but don't reveal this information
    const user = await User.findOne({ email });

    // In a real application, you would:
    // 1. Generate a reset token
    // 2. Save it to the user record with an expiration
    // 3. Send an email with the reset link
    // For now, we'll just return a success message

    return NextResponse.json(
      { message: 'If an account exists, a reset link will be sent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { message: 'Error processing request' },
      { status: 500 }
    );
  }
}