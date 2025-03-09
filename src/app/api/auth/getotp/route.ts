import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import nodemailer from "nodemailer";

interface getOTPRequest {
    email: string;
}

const mailTransporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_NODEMAILER_EMAIL,
        pass: process.env.GMAIL_NODEMAILER_PASSWORD,
    },
});

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        console.log("sendotp request received");
        const body: getOTPRequest = await req.json();
        const { email } = body;

        const dbUser = await User.findOne({ email });
        if (!dbUser) {
            return NextResponse.json({ error: "User not found" }, { status: 400 });
        }

        const otp = Math.floor(100000 + Math.random() * 900000);
        dbUser.otp = otp;
        await dbUser.save();

        setTimeout(async () => {
            dbUser.otp = "";
            await dbUser.save();
        }, 300000);

        const mailDetails = {
            from: process.env.GMAIL_NODEMAILER_EMAIL,
            to: email,
            subject: "Login with your OTP",
            html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <title>OTP for Login</title>
                <style>
                    .container { width: 50%; margin: 0 auto; background: #f4f4f4; padding: 20px; }
                    h1 { text-align: center; }
                </style>
            </head>
            <body>
                <strong><h1>Conversa - online chatting app</h1></strong>
                <div class="container">
                    <h2>Your OTP is</h2>
                    <strong><p>${otp}</p></strong>
                    <p>Use this OTP to login</p>
                </div>
            </body>
            </html>`,
        };

        await mailTransporter.sendMail(mailDetails);
        console.log("Email sent successfully");
        return NextResponse.json({ message: "OTP sent" }, { status: 200 });
    } catch (error) {
        console.error("Error Occurs", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}