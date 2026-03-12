import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import dbConnect from '@/lib/db';
import Book from '@/models/Book';
import LendingTracker from '@/components/LendingTracker';

export const metadata = {
  title: 'Lending Tracker - Home Library',
  description: 'Keep track of your books currently loaned out to friends.',
};

export default async function LendingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  await dbConnect();
  const books = await Book.find({
    user: session.user.id,
    loanedTo: { $exists: true, $ne: null, $nin: [''] },
  })
    .lean()
    .exec();

  // Serialize MongoDB documents to plain objects
  const serialized = (books as any[]).map((b) => ({
    _id: b._id.toString(),
    title: b.title,
    author: b.author,
    coverImageUrl: b.coverImageUrl ?? undefined,
    loanedTo: b.loanedTo ?? undefined,
    loanDate: b.loanDate ? new Date(b.loanDate).toISOString() : undefined,
    totalPages: b.totalPages,
    currentPage: b.currentPage ?? 0,
  }));

  return <LendingTracker initialBooks={serialized} />;
}
