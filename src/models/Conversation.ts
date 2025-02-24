import { IConversation } from "@/types";
import { Schema, Types, model, models } from "mongoose";



const ConversationSchema = new Schema<IConversation>(
    {
        members: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        latestMessage: {
            type: Schema.Types.ObjectId,
            ref: 'Message',
        },
        isGroup: {
            type: Boolean,
            default: false,
        },
        name: {
            type: String,
            required: function (this: IConversation) {
                return this.isGroup;
            },
        },
        unreadCounts: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                },
                count: {
                    type: Number,
                    default: 0,
                },
            },
        ],
        lists: [
            {
                type: Schema.Types.ObjectId,
                ref: 'List',
            },
        ],
        isDeleted: { type: Boolean, required: true, default: false },
        deletedAt: { type: Date, required: false },
    },
    {
        timestamps: true,
    }
);

// Prevent model redefinition in Next.js hot-reloading
export default models.Conversation || model<IConversation>('Conversation', ConversationSchema);