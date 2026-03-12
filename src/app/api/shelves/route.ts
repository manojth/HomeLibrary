import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Shelf from '@/models/Shelf';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const shelves = await Shelf.find({ user: session.user.id }).sort({ name: 1 });
    return NextResponse.json(shelves);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const body = await req.json();
    
    if (!body.name) {
      return NextResponse.json({ error: 'Shelf name is required' }, { status: 400 });
    }

    const newShelf = await Shelf.create({
      name: body.name,
      user: session.user.id,
    });

    return NextResponse.json(newShelf, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
