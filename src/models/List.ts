import { IList } from '@/types';
import mongoose, { Schema, Document, Types } from 'mongoose';



// Define the List Schema
const ListSchema = new Schema<IList>(
    {
        name: {
            type: String,
            required: true,
            trim: true, // Remove leading/trailing whitespace
            unique: true, // Ensure list names are unique
        },
        isPredefined: {
            type: Boolean,
            default: false, // False for custom lists, true for predefined ones (unread, favorite, groups)
        },
        isDeleted: { type: Boolean, required: true, default: false },
        deletedAt: { type: Date, required: false },
    },
    {
        timestamps: true,
    }
);

// Prevent model redefinition in Next.js hot-reloading
export default mongoose.models.List || mongoose.model<IList>('List', ListSchema);