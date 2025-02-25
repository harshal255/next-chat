import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    //docs link 🚀📄🔗: https://next-auth.js.org/providers/credentials
    providers: [
        CredentialsProvider({
            // The name to display on the sign in form (e.g. "Sign in with...")
            name: "Credentials",
            // `credentials` is used to generate a form on the sign in page.
            // You can specify which fields should be submitted, by adding keys to the `credentials` object.
            // e.g. domain, email, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                email: { label: "Email", type: "text", placeholder: "Enter Your Email Here..." },
                password: { label: "Password", type: "password",placeholder: "Enter Your Password Here..." }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password");
                }
                try {
                    // Add logic here to look up the user from the credentials supplied
                    await dbConnect();
                    const user = await User.findOne({ email: credentials?.email });

                    if (!user) {
                        throw new Error("No User Found");
                    }

                    const isVaid = await bcrypt.compare(
                        credentials.password,
                        user.password
                    )

                    if (!isVaid) {
                        throw new Error("Invalid Password");
                    }
                    //⚠️ extract all users information from the database
                    console.log({ user });
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email,
                        about: user.about,
                        mobileNo: user.mobileNo,
                        profilePic: user.profilePic,
                        otp: user.otp,
                        isOnline: user.isOnline,
                        isDeleted: user.isDeleted,
                        lastSeen: user.lastSeen,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt,
                    }

                } catch (error) {
                    throw error;
                }
            }
        })
    ],
    //docs link 🚀📄🔗: https://next-auth.js.org/configuration/callbacks
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                const customUser = user as any; // Bypass TypeScript checks
                token.id = customUser.id;
                token.name = customUser.name;
                token.email = customUser.email;
                token.about = customUser.about;
                token.mobileNo = customUser.mobileNo;
                token.profilePic = customUser.profilePic;
                token.otp = customUser.otp;
                token.isOnline = customUser.isOnline;
                token.isDeleted = customUser.isDeleted;
                token.lastSeen = customUser.lastSeen;
                token.createdAt = customUser.createdAt;
                token.updatedAt = customUser.updatedAt;
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.name = token.name;
                session.user.email = token.email;
                session.user.about = token.about;
                session.user.mobileNo = token.mobileNo;
                session.user.profilePic = token.profilePic;
                session.user.otp = token.otp;
                session.user.isOnline = token.isOnline;
                session.user.isDeleted = token.isDeleted;
                session.user.lastSeen = token.lastSeen;
                session.user.createdAt = token.createdAt;
                session.user.updatedAt = token.updatedAt;
            }
            return session
        },
    },
    pages:{
        signIn:'/'
    },
    //docs link 🚀📄🔗 : https://next-auth.js.org/configuration/options
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60
    },
    secret: process.env.NEXTAUTH_SECRET
}