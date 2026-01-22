import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, email, fullName, role } = body;

    if (!id || !email || !fullName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (!['guest', 'host'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    const newUser = await db.insert(users).values({
      id,
      email,
      fullName,
      role,
    }).returning();

    return NextResponse.json({ user: newUser[0] }, { status: 201 });
  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
