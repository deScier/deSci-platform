import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
   const healthCheck = {
      timestamp: new Date().toISOString(),
      version: 'v1.3',
      status: 'OK'
   }

   return NextResponse.json(healthCheck, { status: 200 })
}
