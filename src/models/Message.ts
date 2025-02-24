import { IMessage } from '@/types';
import mongoose, { Schema } from 'mongoose';



const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: 'Conversation',
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    text: {
      type: String,
      required: function (this: IMessage) {
        return !this.imageUrl; // Text is required if imageUrl is not present
      },
    },
    imageUrl: {
      type: String,
      required: function (this: IMessage) {
        return !this.text; // ImageUrl is required if text is not present
      },
    },
    reaction: {
      type: String,
      default: '',
    },
    seenBy: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: 'User',
        },
        seenAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    deletedFrom: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    replyTo: {
      type: Schema.Types.ObjectId,
      default: null,
      ref: 'Message',
    },
    isDeleted: { type: Boolean, required: true, default: false },
    deletedAt: { type: Date, required: false },
  },
  {
    timestamps: true,
  }
);

// Prevent model redefinition in Next.js hot-reloading
export default mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema);