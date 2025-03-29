import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User } from '../interfaces/userInterface';


export interface IUser extends Document {
  email: string;
  password: string;
  campus: string; 
  verified: boolean;
  walletAddress?: string; 
  name?: string;
  phone?: string;
  rating: number; 
  feedbackCount: number; 
  role:string;
  admissionYear: string;
  course: string;
  department : string;
}

const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      match: [
        /@.*\.(edu|ac\.in)$/i,
        "Use a valid university email (.edu or .ac.in)",
      ],
      index: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    campus: {
      type: String,
      required: [true, "Campus is required"],
      index: true,
    },
    verified: { type: Boolean, default: false },
    walletAddress: { type: String, sparse: true }, // Optional, unique where present
    name: { type: String },
    phone: { type: String },
    admissionYear: { type: String },
    course: { type: String },
    department: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    feedbackCount: { type: Number, default: 0 },
    role: {
      type: String,
      required: true,
      default: "user",
    },
  },
  { timestamps: true }
);



export default model<IUser>("User", UserSchema);
