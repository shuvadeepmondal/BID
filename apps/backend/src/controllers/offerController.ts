import { Request, Response } from "express";
import OfferRequest, { IOfferRequest } from "../models/OfferRequest";
import Product from "../models/Product";
import mongoose from "mongoose";

export const createOffer = async (req: Request, res: Response) => {
  const { productId, offeredPrice } = req.body;
  const user = (req as any).user;

  // Check if user is authenticated
  if (!user || !user._id) {
    return res
      .status(401)
      .json({ message: "Authentication required: User not found in request" });
  }

  try {
    // Find the product by ID
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    console.log(product.user.toString());
    console.log(user._id.toString());

    // Check if the user is trying to offer on their own product
    if (product.user.toString() === user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot make an offer on your own product" });
    }

    // Create the offer
    const offer = new OfferRequest({
      product: productId,
      buyer: user._id,
      offeredPrice,
    });
    await offer.save();

    res.status(201).json(offer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
export const getMyOfferRequests = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const offers = await OfferRequest.find({
      product: { $in: await Product.find({ user: user._id }) },
    })
      .populate("product", "name")
      .populate("buyer", "name email");
    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const respondToOffer = async (req: Request, res: Response) => {
  const { offerId, status } = req.body;
  const user = (req as any).user;

  try {
    const offer = await OfferRequest.findById(offerId).populate("product");
    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if ((offer.product as any).user.toString() !== user._id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    offer.status = status;
    await offer.save();
    res.json(offer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


export const getAcceptedOffers = async (req: Request, res: Response) => {
  const user = (req as any).user;

  // Check if user is authenticated
  if (!user || !user._id) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const acceptedOffers = await OfferRequest.find({
      status: "accepted",
      $or: [
        { buyer: user._id }, // User is the buyer
        { "product.user": user._id }, // User is the seller
      ],
    })
      .populate("product", "name user") // Populate product details
      .populate("buyer", "name email"); // Populate buyer details

    if (!acceptedOffers.length) {
      return res
        .status(200)
        .json({ message: "No accepted offers found", data: [] });
    }

    res
      .status(200)
      .json({ message: "Accepted offers retrieved", data: acceptedOffers });
  } catch (error) {
    console.error("Error fetching accepted offers:", error);
    res.status(500).json({
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};