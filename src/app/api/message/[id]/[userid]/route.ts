import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/next-auth-options";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { params: { id: string; userid: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        await dbConnect();

        const { id: conversationId } = await params.params;
        const userId = session.user.id;
        const messages = await Message.find({
            conversationId,
            deletedFrom: { $ne: userId },
        });

        if (!messages) {
            return NextResponse.json({ error: "Message Not Found" }, { status: 400 });
        }
        console.log({ messages });

        messages.forEach(async (message) => {
            let isUserAddedToSeenBy = false;
            message.seenBy.forEach((element: any) => {
                if (element.user == userId) {
                    isUserAddedToSeenBy = true;
                }
            });
            if (!isUserAddedToSeenBy) {
                message.seenBy.push({ user: userId });
            }
            await message.save();
        });
        return NextResponse.json({ messages }, { status: 200 });
    } catch (error: any) {
        console.error(error.message);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });

    }
}