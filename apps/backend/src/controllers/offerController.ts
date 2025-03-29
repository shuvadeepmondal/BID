import { Request, Response } from "express";
import OfferRequest, { IOfferRequest } from "../models/OfferRequest";
import Product from "../models/Product";

export const createOffer = async (req: Request, res: Response) => {
  const { productId, offeredPrice } = req.body;
  const user = (req as any).user;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

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
