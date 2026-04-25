import { NextResponse } from 'next/server';
import { CONTENT_DETAIL_MAP } from '@/data/content-data';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const numericId = Number(id);

  if (isNaN(numericId)) {
    return NextResponse.json({ message: '잘못된 콘텐츠 ID입니다.' }, { status: 400 });
  }

  const detail = CONTENT_DETAIL_MAP.get(numericId);
  if (!detail) {
    return NextResponse.json({ message: '존재하지 않는 콘텐츠입니다.' }, { status: 404 });
  }

  return NextResponse.json(detail);
}
