import { Request, Response } from "express";
import ExchangeRequest, { IExchangeRequest } from "../models/ExchangeRequest";
import Product from "../models/Product";

export const createExchange = async (req: Request, res: Response) => {
  const { productRequestedId, productOfferedId } = req.body;
  const user = (req as any).user;

  try {
    const requested = await Product.findById(productRequestedId);
    const offered = await Product.findById(productOfferedId);
    if (!requested || !offered)
      return res.status(404).json({ message: "Product not found" });
    if (offered.user.toString() !== user.id) {
      return res
        .status(403)
        .json({ message: "You can only offer your own products" });
    }

    const exchange = new ExchangeRequest({
      productRequested: productRequestedId,
      productOffered: productOfferedId,
      requester: user.id,
    });
    await exchange.save();
    res.status(201).json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const getMyExchangeRequests = async (req: Request, res: Response) => {
  const user = (req as any).user;
  try {
    const exchanges = await ExchangeRequest.find({
      $or: [
        { requester: user.id },
        { productRequested: { $in: await Product.find({ user: user.id }) } },
      ],
    })
      .populate("productRequested", "name")
      .populate("productOffered", "name")
      .populate("requester", "name email");
    res.json(exchanges);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

export const respondToExchange = async (req: Request, res: Response) => {
  const { exchangeId, status } = req.body;
  const user = (req as any).user;

  try {
    const exchange =
      await ExchangeRequest.findById(exchangeId).populate("productRequested");
    if (!exchange)
      return res.status(404).json({ message: "Exchange not found" });
    if ((exchange.productRequested as any).user.toString() !== user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    exchange.status = status;
    await exchange.save();
    res.json(exchange);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};
