import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/next-auth-options";
import Conversation from "@/models/Conversation";
import Message from "@/models/Message";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  var imageurl = "";

  // if (req.file) {
  //   imageurl = await imageupload(req.file, false);
  // }

  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();
    const body = await req.json();
    const { conversationId, senderId, text } = body;
    if (!conversationId || !senderId || !text) {
      return NextResponse.json({ error: "Please fill all the fields" }, { status: 400 });
    }

    const conversation = await Conversation.findById(conversationId).populate(
      "members",
      "-password"
    );

    console.log({ conversation: JSON.stringify(conversation) });

    //check if conversation contains bot
    var isbot = false;

    conversation.members.forEach((member: any) => {
      if (member.email.includes("bot")) {
        isbot = true;
      }
    });

    // if (!isbot) {
      const newMessage = new Message({
        conversationId,
        senderId,
        text,
        imageurl,
        seenBy: [],
      });

      await newMessage.save();
      console.log("newMessage saved");

      conversation.updatedAt = new Date();
      await conversation.save();
      return NextResponse.json({ newMessage }, { status: 200 });
    // }
  } catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }

}