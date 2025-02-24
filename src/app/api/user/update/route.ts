import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/next-auth-options";

export async function PUT(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const dbUser = await User.findById(session.user.id);
        const body = await req.json();

        if (body.newpassword) {
            const passwordCompare = await bcrypt.compare(body.oldpassword, dbUser.password);
            if (!passwordCompare) {
                return NextResponse.json({ error: "Invalid Credentials" }, { status: 400 });
            }
            const secPass = body.newpassword
            body.password = secPass;
            delete body.oldpassword;
            delete body.newpassword;
        }

        await User.findByIdAndUpdate(session.user.id, body, { new: true });
        return NextResponse.json({ message: "Profile Updated" }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}