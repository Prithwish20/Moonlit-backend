import express from "express";

import {

    createInvoiceController,

    getSingleInvoiceController,

    getMyInvoicesController,

    deleteInvoiceController

} from "../controllers/invoice.controller.js";


import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";



const router =
    express.Router();



/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.post(

    "/:orderId",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    createInvoiceController
);





/*
|--------------------------------------------------------------------------
| Get Logged In User Invoices
|--------------------------------------------------------------------------
*/

router.get(

    "/my-invoices",

    protect,

    getMyInvoicesController
);





/*
|--------------------------------------------------------------------------
| Get Single Invoice
|--------------------------------------------------------------------------
*/

router.get(

    "/:invoiceId",

    protect,

    getSingleInvoiceController
);





/*
|--------------------------------------------------------------------------
| Delete Invoice
|--------------------------------------------------------------------------
| DEVELOPER ONLY
|--------------------------------------------------------------------------
*/

router.delete(

    "/:invoiceId",

    protect,

    authorize(
        "DEVELOPER"
    ),

    deleteInvoiceController
);



export default router;