import { DefaultSession, DefaultJWT } from "next-auth";

// Extend the Session type
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      about?: string;
      mobileNo?: string;
      profilePic?: string;
      otp?: string;
      isOnline?: boolean;
      isDeleted?: boolean;
      lastSeen?: Date | string; 
      createdAt?: Date | string;
      updatedAt?: Date | string;
    } & DefaultSession["user"];
  }
}

// Extend the JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    about?: string;
    mobileNo?: string;
    profilePic?: string;
    otp?: string;
    isOnline?: boolean;
    isDeleted?: boolean;
    lastSeen?: Date | string;
    createdAt?: Date | string;
    updatedAt?: Date | string;
  }
}