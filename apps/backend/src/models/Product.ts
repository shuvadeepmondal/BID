import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  images: string[]; // Array of image URLs
  condition: 1 | 2 | 3 | 4 | 5; // Star rating (1-5)
  description: string;
  category: string; // e.g., "textbook", "electronics"
  price: number; // In fiat currency (e.g., INR)
  acceptsCrypto: boolean;
  walletAddress?: string; // Seller's crypto wallet if acceptsCrypto is true
  user: mongoose.Types.ObjectId;
  campus: string;
  status: "available" | "pending" | "sold" | "expired";
  tags?: string[]; // e.g., ["CS101", "used"]
  views: number; // Track popularity
}

const ProductSchema: Schema = new Schema(
  {
    name: { type: String, required: [true, "Product name is required"] },
    images: [
      { type: String, required: [true, "At least one image is required"] },
    ],
    condition: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "Condition rating is required"],
    },
    description: { type: String, required: [true, "Description is required"] },
    category: { type: String, required: [true, "Category is required"] },
    price: { type: Number, required: [true, "Price is required"], min: 0 },
    acceptsCrypto: { type: Boolean, default: false },
    walletAddress: {
      type: String,
      required: function () {
        return (this as any).acceptsCrypto;
      },
    },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    campus: { type: String, required: true, index: true },
    status: {
      type: String,
      enum: ["available", "pending", "sold", "expired"],
      default: "available",
    },
    tags: [{ type: String }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
