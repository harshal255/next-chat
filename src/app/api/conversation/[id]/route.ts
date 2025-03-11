import dbConnect from "@/lib/db";
import { authOptions } from "@/lib/next-auth-options";
import Conversation from "@/models/Conversation";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, params: { params: { id: string } }) {
  try {
    const { id } = await params.params;
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await dbConnect();

    const conversation = await Conversation.findById(id).populate(
      "members",
      "-password",
    );

    if (!conversation) {
      return NextResponse.json({ error: "No conversation found", }, { status: 404 });
    }
    return NextResponse.json({ conversation }, { status: 200 });
  }
  catch (error: any) {
    console.log(error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}