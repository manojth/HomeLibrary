import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query || query.trim().length < 3) {
    return NextResponse.json([]);
  }

  try {
    const res = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=6&langRestrict=en`
    );
    const data = await res.json();

    const books = (data.items || []).map((item: any) => {
      const info = item.volumeInfo;
      return {
        title: info.title || '',
        author: (info.authors || []).join(', '),
        totalPages: info.pageCount ? String(info.pageCount) : '',
        coverImageUrl: info.imageLinks?.thumbnail?.replace('http://', 'https://') || '',
      };
    });

    return NextResponse.json(books);
  } catch {
    return NextResponse.json([]);
  }
}
