import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Conversation from '@/models/Conversation';
import { Types } from 'mongoose';
import { registerSchema } from '@/validation-schema';

// Type for the request body
interface RegisterRequest {
    name: string;
    email: string;
    password: string;
}

export async function POST(request: Request) {
    try {
        console.log('Register request received');

        // Parse the request body
        const body: RegisterRequest = await request.json();

        // Validate the request body with Joi
        const { error, value } = registerSchema.validate(body, { abortEarly: false });
        if (error) {
            return NextResponse.json({ error: error.details.map((d) => d.message) }, { status: 400 });
        }

        const { name, email, password } = value;


        // Connect to the database
        await dbConnect();

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        // Generate a default profile picture URL
        const imageUrl = `https://ui-avatars.com/api/?name=${name}&background=random&bold=true`;


        // Create the new user
        const newUser = new User({
            name,
            email,
            password,
            profilePic: imageUrl,
            about: 'Hello World!!',
        });

        await newUser.save();

        // Create a bot user for the chatbot feature
        const ObjectId = new Types.ObjectId();
        const botUser = new User({
            _id: ObjectId,
            name: 'AI Chatbot',
            email: email + 'bot',
            about: 'I am an AI Chatbot to help you',
            profilePic: 'https://play-lh.googleusercontent.com/Oe0NgYQ63TGGEr7ViA2fGA-yAB7w2zhMofDBR3opTGVvsCFibD8pecWUjHBF_VnVKNdJ',
            password: 'default-bot-password',
        });

        await botUser.save();

        // Create a new conversation between the user and the bot
        const newConversation = new Conversation({
            members: [newUser._id, botUser._id],
        });

        await newConversation.save();
        return NextResponse.json({ message: "user registered successfully" }, { status: 200 })

    } catch (error) {
        console.log({ error, route: "register" });
        return NextResponse.json({ error: "failed to register user" }, { status: 500 })
    }
}