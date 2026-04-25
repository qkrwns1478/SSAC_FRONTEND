import { NextResponse } from 'next/server';
import { PERSONALIZED_RECOMMENDED } from '@/data/content-data';

export async function GET() {
  return NextResponse.json(PERSONALIZED_RECOMMENDED);
}
