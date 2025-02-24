import { authOptions } from "@/lib/next-auth-options";
import NextAuth from "next-auth"


//docs link 🚀📄🔗: https://next-auth.js.org/configuration/initialization


const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }