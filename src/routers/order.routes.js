import express from "express";

import {

    createOrderController,

    getMyOrdersController,

    getSingleOrderController,

    updateOrderStatusController,

    addPaymentController

} from "../controllers/order.controller.js";


import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";
 


const router = express.Router();



/*
|--------------------------------------------------------------------------
| Create Order / Checkout
|--------------------------------------------------------------------------
*/

router.post(
    "/checkout",
    protect,
    createOrderController
);





/*
|--------------------------------------------------------------------------
| Get Logged In User Orders
|--------------------------------------------------------------------------
*/

router.get(
    "/my-orders",
    protect,
    getMyOrdersController
);





/*
|--------------------------------------------------------------------------
| Get Single Order
|--------------------------------------------------------------------------
*/

router.get(
    "/:orderId",
    protect,
    getSingleOrderController
);





/*
|--------------------------------------------------------------------------
| Update Order Status
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.patch(
    "/:orderId/status",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    updateOrderStatusController
);





/*
|--------------------------------------------------------------------------
| Add Payment To Existing Order
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.patch(
    "/:orderId/payment",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    addPaymentController
);



export default router;