import mongoose, { Schema, Document } from "mongoose";

export interface IOfferRequest extends Document {
  product: mongoose.Types.ObjectId;
  buyer: mongoose.Types.ObjectId;
  offeredPrice: number;
  status: "pending" | "accepted" | "rejected";
}

const OfferRequestSchema: Schema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    buyer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    offeredPrice: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOfferRequest>(
  "OfferRequest",
  OfferRequestSchema
);
