import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Shelf from '@/models/Shelf';
import Book from '@/models/Book';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await dbConnect();
    
    const shelf = await Shelf.findOneAndDelete({ _id: id, user: session.user.id });
    
    if (!shelf) return NextResponse.json({ error: 'Shelf not found' }, { status: 404 });

    // Remove shelf reference from all books that had it
    await Book.updateMany(
      { shelves: id },
      { $pull: { shelves: id } }
    );

    return NextResponse.json({ message: 'Shelf deleted' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
