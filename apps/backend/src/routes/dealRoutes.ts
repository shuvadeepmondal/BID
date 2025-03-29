import express from "express";
import { body } from "express-validator";
import {
  createDeal,
  markDealDone,
  submitFeedback,
} from "../controllers/dealController";
import authMiddleware from "../middleware/auth";
import validate from "../middleware/validate";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("productId").notEmpty(),
    body("type").isIn(["direct", "offer", "exchange"]),
    body("landmark").notEmpty(),
    validate,
  ],
  createDeal
);

router.post("/done/:dealId", authMiddleware, markDealDone);

router.post(
  "/feedback",
  authMiddleware,
  [
    body("dealId").notEmpty(),
    body("rating").isInt({ min: 1, max: 5 }),
    body("comment").optional(),
    validate,
  ],
  submitFeedback
);

export default router;
