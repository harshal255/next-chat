import { IUser } from '@/types';
import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';


const UserSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            required: true,
            trim: true,
            minlength: 3,
            maxlength: 50,
        },
        about: {
            type: String,
            default: "",
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
        mobileNo: {
            type: String,
            default:"",
        },
        profilePic: {
            type: String,
            default:
                "https://ui-avatars.com/api/?name=NextChat&background=random&bold=true",
        },
        otp: {
            type: String,
            default: "",
        },
        isOnline: {
            type: Boolean,
            default: false,
        },
        lastSeen: {
            type: Date,
            default: Date.now,
        },
        isDeleted: { type: Boolean, required: true, default: false },
        deletedAt: { type: Date, required: false },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt
    }
);

//call just before data save
UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

// Prevent model redefinition in Next.js hot-reloading
export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);