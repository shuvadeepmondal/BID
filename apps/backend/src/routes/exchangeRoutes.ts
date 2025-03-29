import express from "express";
import { body } from "express-validator";
import {
  createExchange,
  getMyExchangeRequests,
  respondToExchange,
} from "../controllers/exchangeController";
import authMiddleware from "../middleware/auth";
import validate from "../middleware/validate";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("productRequestedId").notEmpty(),
    body("productOfferedId").notEmpty(),
    validate,
  ],
  createExchange
);

router.get("/my-exchanges", authMiddleware, getMyExchangeRequests);
router.post(
  "/respond",
  authMiddleware,
  [
    body("exchangeId").notEmpty(),
    body("status").isIn(["accepted", "rejected"]),
    validate,
  ],
  respondToExchange
);

export default router;
