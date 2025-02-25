import { getToken } from "next-auth/jwt";
import withAuth from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

//docs link 🚀📄🔗: https://next-auth.js.org/configuration/nextjs#middleware

interface NextAuthRequest extends NextRequest {
    nextauth: {
        token: { [key: string]: any } | null;
    };
}

export default withAuth(
    async function middleware(req: NextAuthRequest) {
        console.log("Middleware Called");
        const { pathname } = req.nextUrl;
        const token = await getToken({
            req: req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        // If user is authorized and trying to access "/", redirect to "/dashboard"
        if (pathname === "/" && token) {
            return NextResponse.redirect(new URL("/dashboard", req.url));
        }
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;
                //allow auth related routes
                if (pathname.startsWith("/api/auth")) {
                    return true;
                }

                //public
                if (pathname === "/") {
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