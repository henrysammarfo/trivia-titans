import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default function middleware(request: NextRequest) {
    // Don't block any requests - let the client-side auth handle it
    // The admin page already has useEffect to check session and redirect
    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
