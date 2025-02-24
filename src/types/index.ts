import { Types } from "mongoose";

export interface IUser {
    name: string;
    about: string;
    email: string;
    password: string;
    mobileNo: string;
    profilePic: string;
    otp: string;
    isOnline: boolean;
    lastSeen: Date;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean,
    deletedAt?: Date;
}


export interface IUnreadCount {
    userId: Types.ObjectId;
    count: number;
}

export interface IConversation {
    members: Types.ObjectId[];
    latestMessage: Types.ObjectId;
    isGroup: boolean;
    name?: string;
    unreadCounts: IUnreadCount[];
    lists: Types.ObjectId[]; // References to List documents (multiple lists per conversation)
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean,
    deletedAt?: Date;
}


export interface IList {
    name: string; // Name of the list (e.g., "unread", "favorite", "groups", or custom)
    isPredefined: boolean; // Indicates if the list is one of the predefined types
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean,
    deletedAt?: Date;
}

export interface ISeenBy {
    user: Types.ObjectId;
    seenAt: Date;
}

export interface IMessage {
    conversationId: Types.ObjectId;
    senderId: Types.ObjectId;
    text?: string;
    imageUrl?: string;
    reaction: string;
    seenBy: ISeenBy[];
    deletedFrom: Types.ObjectId[];
    replyTo: Types.ObjectId | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean,
    deletedAt?: Date;
}