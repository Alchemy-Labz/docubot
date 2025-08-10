import { NextResponse } from 'next/server';

export async function GET() {
  console.log('Health check endpoint hit');
  return NextResponse.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'API routes are working'
  });
}

export async function POST() {
  console.log('Health check POST endpoint hit');
  return NextResponse.json({ 
    status: 'ok',
    method: 'POST',
    timestamp: new Date().toISOString(),
    message: 'API routes are working'
  });
}
