import mongoose, { Schema, Document } from "mongoose";

export interface IDeal extends Document {
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  seller: mongoose.Types.ObjectId;
  type: "direct" | "offer" | "exchange";
  finalPrice?: number; // For direct/offer
  exchangeProduct?: mongoose.Types.ObjectId; // For exchange
  landmark: string;
  status: "pending" | "completed";
  buyerFeedback?: {
    rating: number;
    comment?: string;
  };
  sellerFeedback?: {
    rating: number;
    comment?: string;
  };
}

const DealSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["direct", "offer", "exchange"],
      required: true,
    },
    finalPrice: { type: Number, min: 0 },
    exchangeProduct: { type: Schema.Types.ObjectId, ref: "Product" },
    landmark: { type: String, required: [true, "Landmark is required"] },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },
    buyerFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
    sellerFeedback: {
      rating: { type: Number, min: 1, max: 5 },
      comment: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IDeal>("Deal", DealSchema);
