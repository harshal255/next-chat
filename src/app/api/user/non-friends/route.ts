import dbConnect from '@/lib/db';
import { authOptions } from '@/lib/next-auth-options';
import Conversation from '@/models/Conversation';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const userId = session.user.id;
        dbConnect();
        // find all friends(all other members in conversations) and user whose email not endswith bot
        const conversations = await Conversation.find({
            members: { $in: [userId] },
        });

        const users = await User.find({
            _id: { $nin: conversations.flatMap((c) => c.members) },
            email: { $not: /bot$/ },
        });
        return NextResponse.json({ users }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}