import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/next-auth-options";
import Conversation from "@/models/Conversation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

//get conversation list
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = session.user.id;
        dbConnect();
        const conversationList = await Conversation.find({
            members: { $in: userId },
        }).populate("members", "-password"); //remove password fields

        if (!conversationList) {
            return NextResponse.json({ error: "No conversation found", }, { status: 404 });
        }

        // remove user from members and also other chatbots
        for (let i = 0; i < conversationList.length; i++) {
            conversationList[i].members = conversationList[i].members.filter(
                (member: any) => member.id !== userId
            );
        }
        conversationList.sort((a, b) => {
            return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        });
        return NextResponse.json({ conversationList }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}


//create conversation
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        dbConnect();
        const userId = session.user.id;
        const body = await req.json();
        const { members: memberIds } = body;

        if (!memberIds) {
            return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
        }

        const conv = await Conversation.findOne({
            members: { $all: memberIds },
        }).populate("members", "-password");

        if (conv) {
            conv.members = conv.members.filter(
                (memberId: any) => memberId !== userId
            );
            return NextResponse.json({ conv }, { status: 200 });
        }

        const newConversation = await Conversation.create({
            members: memberIds,
            unreadCounts: memberIds.map((memberId: any) => ({
                userId: memberId,
                count: 0,
            })),
        });

        await newConversation.populate("members", "-password");

        newConversation.members = newConversation.members.filter(
            (member: any) => member.id !== userId
        );
        return NextResponse.json({ newConversation }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}