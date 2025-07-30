import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const healthCheck = {
    timestamp: new Date().toISOString(),
    version: 'v1.3',
    status: 'OK',
    message: 'Health check successful. The server is running.',
  };

  return NextResponse.json(healthCheck, { status: 200 });
}
