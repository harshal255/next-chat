import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/next-auth-options";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    const body = await req.json();
    const { msgid, userids } = body;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();
        const message = await Message.findById(msgid);
        console.log({ message });

        userids.forEach(async (userid: any) => {
            if (!message.deletedFrom.includes(userid)) {
                message.deletedFrom.push(userid);
            }
        });
        await message.save();
        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error: any) {
        console.log(error.message);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}