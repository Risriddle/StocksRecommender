
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import {User} from '@/lib/db/models/User';

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, email, password } = await req.json();
   
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      );
    }

   

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: 'admin',
    });


    return NextResponse.json(
      { message: 'Admin User created successfully' },
      { status: 201 }
    );
    
  } catch (error: any) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { message: 'Error creating user' },
      { status: 500 }
    );
  }
}