import express from "express";
import { body } from "express-validator";
import {
  createOffer,
  getMyOfferRequests,
  respondToOffer,
} from "../controllers/offerController";
import authMiddleware from "../middleware/auth";
import validate from "../middleware/validate";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [body("productId").notEmpty(), body("offeredPrice").isNumeric(), validate],
  createOffer
);

router.get("/my-offers", authMiddleware, getMyOfferRequests);
router.post(
  "/respond",
  authMiddleware,
  [
    body("offerId").notEmpty(),
    body("status").isIn(["accepted", "rejected"]),
    validate,
  ],
  respondToOffer
);

export default router;
