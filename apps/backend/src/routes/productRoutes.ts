import express from "express";
import { body } from "express-validator";
import {
  createProduct,
  getProductsByCampus,
  getMyProducts,
  getProductById
} from "../controllers/productController";
import authMiddleware from "../middleware/auth";
import validate from "../middleware/validate";
const router = express.Router();

router.post(
  "/",
  authMiddleware,
  [
    body("name").notEmpty(),
    body("images").isArray({ min: 1 }),
    body("condition").isIn([1, 2, 3, 4, 5]),
    body("description").notEmpty(),
    body("category").notEmpty(),
    body("price").isNumeric(),
    validate,
  ],
  createProduct
);

router.get("/:campus", getProductsByCampus);
router.get("/:campus/my-products", authMiddleware, getMyProducts);
router.get("/:campus/items/:productId", authMiddleware, getProductById);


export default router;
