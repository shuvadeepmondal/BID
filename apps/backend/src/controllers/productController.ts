import { Request, Response } from "express";
import Product, { IProduct } from "../models/Product";
import User, { IUser } from "../models/User"; // Import User model

export const createProduct = async (req: Request, res: Response) => {
  const {
    name,
    images,
    condition,
    description,
    category,
    price,
    acceptsCrypto,
    walletAddress,
    tags,
  } = req.body;
  const user = (req as any).user; // User from auth middleware
  console.log(user);
  
   if (!user || !user._id) {
     return res
       .status(401)
       .json({ message: "Authentication required: User not found in request" });
   }

  try {
    // Fetch the user to get their campus
    const userDoc: IUser | null = await User.findById(user._id);
    if (!userDoc) {
      return res.status(404).json({ message: "User not found" });
    }

    const product = new Product({
      name,
      images,
      condition,
      description,
      category,
      price,
      acceptsCrypto,
      walletAddress: acceptsCrypto ? walletAddress : undefined,
      user: user._id,
      campus: userDoc.campus, // Use campus from fetched user
      tags,
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getProductsByCampus = async (req: Request, res: Response) => {
  const { campus } = req.params;
  try {
    const products = await Product.find({
      campus,
      status: "available",
    }).populate("user", "name email");
    if (!products.length) {
      return res
        .status(404)
        .json({ message: "No products found for this campus" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMyProducts = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const products = await Product.find({ user: user.id });
    if (!products.length) {
      return res.status(404).json({ message: "You have no products listed" });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
