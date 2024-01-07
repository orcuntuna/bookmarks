import {createMiddlewareClient} from '@supabase/auth-helpers-nextjs'
import {NextResponse} from 'next/server'

import type {NextRequest} from 'next/server'

export async function middleware(req: NextRequest) {

  const res = NextResponse.next()

  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({req, res})

  // Refresh session if expired - required for Server Components
  const session = await supabase.auth.getSession()

  if (!session.data.session) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

// Ensure the middleware is only called for relevant paths.
export const config = {
  matcher: [
    /*'/((?!_next/static|_next/image|favicon.ico).*)',*/
    "/groups/:path*"
  ],
}
