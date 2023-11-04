import { getToken } from 'next-auth/jwt'
import { getSession } from 'next-auth/react'
import { NextRequest, NextResponse } from 'next/server'
/**
 * @title Authentication Middleware
 * @notice This middleware ensures that a user is authenticated by
 * checking for the presence of the 'next-auth.session-token' cookie. If
 * the cookie is absent and the user is not on the `/login` page, they
 * will be redirected to the login page.
 *
 * @dev This middleware is particularly useful for Next.js applications
 * where server-side authentication checks are crucial for protecting
 * sensitive routes.
 */

const publicRoutes = ['/home']

export async function middleware(request: NextRequest) {
   /** @dev Extract the 'next-auth.session-token' cookie from the request. */
   const standard = request.cookies.get('next-auth.session-token') ?? request.cookies.get('next-auth.session-token.0')
   const secure = request.cookies.get('__Secure-next-auth.session-token')

   /** @dev Determine if the user is authenticated. */
   const isAuthenticated = standard || secure

   const session = (await getToken({
      req: request
   })) as any

   /**
    * @notice Check for the absence of the authentication cookie.
    * @dev If the user isn't authenticated and isn't already on the
    * `/login` page, redirect them to the login page.
    */
   if (!isAuthenticated && !publicRoutes.includes(request.nextUrl.pathname)) {
      const url = request.nextUrl.clone()
      url.pathname = '/home'

      return NextResponse.redirect(url)
   }

   if (session && session.userInfo.role !== 'ADMIN' && request.nextUrl.pathname === '/descier/articles-for-approval') {
      const url = request.nextUrl.clone()
      url.pathname = '/summary'

      return NextResponse.redirect(url)
   }

   if (isAuthenticated && request.nextUrl.pathname === '/login') {
      /**
       * @notice Check for the presence of the authentication cookie.
       * @dev If the user is authenticated and is on the `/login` page,
       * redirect them to the home page.
       */
      const url = request.nextUrl.clone()
      url.pathname = '/'
      return NextResponse.redirect(url)
   }

   /** @dev If the above conditions aren't met, simply continue with the request. */
   return NextResponse.next()
}

/**
 * @notice Configures the routes this middleware should be applied to.
 * @dev The matcher pattern ensures the middleware isn't applied to API
 * routes or routes that include a `.`, which can be considered static
 * assets.
 */
export const config = {
   matcher: [
      /*
       * Match all request paths except for the ones starting with:
       * - api (API routes)
       * - _next/static (static files)
       * - _next/image (image optimization files)
       * - favicon.ico (favicon file)
       * - /public/* (public files)
       */
      '/((?!api|_next/static|_next/image|favicon.ico|svgs/|home/).*)'
   ]
}
