import { NextResponse,NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/db/connect';
import {User} from '@/lib/db/models/User'    ;


export async function POST(req:NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

console.log(email,"email of adminnnnnnnnnnnnnnnnnn")
    const admin = await User.findOne({ email });
    console.log(admin)
    if (!admin) {
      return NextResponse.json({ message: 'Admin not found' }, { status: 404 });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }


    const secret=process.env.NEXTAUTH_SECRET||""
    const token = jwt.sign({ id: admin._id, role: 'admin' }, secret, {
      expiresIn: '1d',
    });
console.log(token)
    return NextResponse.json({ message: 'Login successful', token }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
