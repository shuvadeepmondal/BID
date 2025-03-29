import mongoose, { Schema, Document } from "mongoose";

export interface IExchangeRequest extends Document {
  productRequested: mongoose.Types.ObjectId; // Product buyer wants
  productOffered: mongoose.Types.ObjectId; // Product buyer offers
  requester: mongoose.Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
}

const ExchangeRequestSchema: Schema = new Schema(
  {
    productRequested: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    productOffered: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    requester: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IExchangeRequest>(
  "ExchangeRequest",
  ExchangeRequestSchema
);
