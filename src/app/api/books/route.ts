import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await dbConnect();
    const { searchParams } = new URL(req.url);
    const q = searchParams.get('q');
    const status = searchParams.get('status');
    const shelf = searchParams.get('shelf');

    const filter: any = { user: session.user.id };
    
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { author: { $regex: q, $options: 'i' } }
      ];
    }
    
    if (status) filter.status = status;
    if (shelf) filter.shelves = shelf;
    
    const books = await Book.find(filter).sort({ createdAt: -1 }).populate('shelves');
    return NextResponse.json(books);
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
    
    if (!body.title || !body.author || body.totalPages === undefined) {
      return NextResponse.json({ error: 'Missing required book details' }, { status: 400 });
    }

    const newBook = await Book.create({
      ...body,
      user: session.user.id,
    });

    return NextResponse.json(newBook, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
