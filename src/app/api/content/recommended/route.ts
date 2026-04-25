import { NextResponse } from 'next/server';
import { TREND_RECOMMENDED } from '@/data/content-data';

export async function GET() {
  return NextResponse.json(TREND_RECOMMENDED);
}
