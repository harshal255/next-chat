import withAuth from "next-auth/middleware";
import { NextResponse } from "next/server";

//docs link 🚀📄🔗: https://next-auth.js.org/configuration/nextjs#middleware

export default withAuth(
    function middleware() {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                //allow auth related routes
                if (pathname.startsWith("/api/auth") || pathname === "/login" || pathname === "/register") {
                    return true;
                }

                //public
                if (pathname === "/" || pathname.startsWith("/api/video")) {
                    return true;
                }

                return !!token;
            }
        },
    },
)


//where to run middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    ],
};