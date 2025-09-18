
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://nfs.faireconomy.media/ff_calendar_thisweek.json', {
        cache: 'no-store', // Added to prevent server-side caching issues
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
    });
    
    if (!response.ok) {
      // Log the error response from the external API for debugging
      const errorBody = await response.text();
      console.error(`External API Error: ${response.status} ${response.statusText}`, errorBody);
      throw new Error(`Failed to fetch from external API: ${response.statusText}`);
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch calendar data', details: message }, { status: 500 });
  }
}
