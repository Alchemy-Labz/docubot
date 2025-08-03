import { NextRequest, NextResponse } from 'next/server';

const BEEHIIV_API_URL = 'https://api.beehiiv.com/v2/subscribers';
const BEEHIIV_API_KEY = process.env.NEXT_PUBLIC_BEEHIV_API_KEY; // Set this in your environment variables

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
    }

    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${process.env.BEEHIIV_PUBLICATION_ID}/subscribers`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.BEEHIIV_API_KEY}`,
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error('Beehiiv API error:', data);
      return new Response(JSON.stringify({ error: 'Beehiiv API error', details: data }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (err) {
    console.error('Server error:', err);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 });
  }
}
