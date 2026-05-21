import express from "express";

import {

    addToCartController,

    getCartController,

    removeCartItemController,

    clearCartController

} from "../controllers/cart.controller.js";


import {

    protect

} from "../middleware/auth.middleware.js";



const router = express.Router();



/*
|--------------------------------------------------------------------------
| Protected Cart Routes
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

router.post(
    "/",
    protect,
    addToCartController
);




/*
|--------------------------------------------------------------------------
| Get User Cart
|--------------------------------------------------------------------------
*/

router.get(
    "/",
    protect,
    getCartController
);




/*
|--------------------------------------------------------------------------
| Remove Single Cart Item
|--------------------------------------------------------------------------
*/

router.delete(
    "/:itemId",
    protect,
    removeCartItemController
);




/*
|--------------------------------------------------------------------------
| Clear Entire Cart
|--------------------------------------------------------------------------
*/

router.delete(
    "/clear",
    protect,
    clearCartController
);



export default router;