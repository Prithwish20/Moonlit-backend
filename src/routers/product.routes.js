import express from "express";

import {

    createProductController,

    getProductsController,

    getSingleProductController,

    updateProductController,

    deleteProductController

} from "../controllers/product.controller.js";

import {
    calculatePriceController
} from "../controllers/pricing.controller.js";

import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";



const router = express.Router();



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Get All Products
router.get(
    "/",
    getProductsController
);


// Get Single Product
router.get(
    "/:slug",
    getSingleProductController
);




/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Create Product
router.post(
    "/",
    protect,
    authorize("OWNER", "DEVELOPER"),
    createProductController
);


// Update Product
router.patch(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    updateProductController
);


// Delete Product
router.delete(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    deleteProductController
);


//calculate price
router.post(
    "/calculate-price",
    calculatePriceController
);
export default router;