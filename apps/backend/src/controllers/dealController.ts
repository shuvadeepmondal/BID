import { Request, Response } from "express";
import Deal, { IDeal } from "../models/Deal";
import Product from "../models/Product";
import User from "../models/User";

export const createDeal = async (req: Request, res: Response) => {
  const { productId, type, finalPrice, exchangeProductId, landmark } = req.body;
  const user = (req as any).user;

  try {
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const deal = new Deal({
      product: productId,
      buyer: user._id,
      seller: product.user,
      type,
      finalPrice: type === "exchange" ? undefined : finalPrice,
      exchangeProduct: type === "exchange" ? exchangeProductId : undefined,
      landmark,
    });
    await deal.save();

    product.status = "pending";
    await product.save();

    res.status(201).json(deal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const markDealDone = async (req: Request, res: Response) => {
  const { dealId } = req.params;
  const user = (req as any).user;

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    if (
      deal.buyer.toString() !== user.id &&
      deal.seller.toString() !== user.id
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    deal.status = "completed";
    await deal.save();

    const product = await Product.findById(deal.product);
    product.status = "sold";
    await product.save();

    if (deal.type === "exchange") {
      const exchangeProduct = await Product.findById(deal.exchangeProduct);
      exchangeProduct.status = "sold";
      await exchangeProduct.save();
    }

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const submitFeedback = async (req: Request, res: Response) => {
  const { dealId, rating, comment } = req.body;
  const user = (req as any).user;

  try {
    const deal = await Deal.findById(dealId);
    if (!deal) return res.status(404).json({ message: "Deal not found" });
    if (deal.status !== "completed")
      return res.status(400).json({ message: "Deal not completed" });

    const isBuyer = deal.buyer.toString() === user.id;
    const isSeller = deal.seller.toString() === user.id;
    if (!isBuyer && !isSeller)
      return res.status(403).json({ message: "Not authorized" });

    const feedback = { rating, comment };
    if (isBuyer) deal.buyerFeedback = feedback;
    if (isSeller) deal.sellerFeedback = feedback;
    await deal.save();

    // Update user rating
    const targetUser = isBuyer
      ? await User.findById(deal.seller)
      : await User.findById(deal.buyer);
    targetUser.feedbackCount += 1;
    targetUser.rating =
      (targetUser.rating * (targetUser.feedbackCount - 1) + rating) /
      targetUser.feedbackCount;
    await targetUser.save();

    res.json(deal);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
