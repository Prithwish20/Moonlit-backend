import express from "express";

import {

    getDashboardSummaryController,

    getRevenueAnalyticsController,

    getAppointmentAnalyticsController,

    getTopSellingProductsController,

    getDoctorAnalyticsController

} from "../controllers/analytics.controller.js";


import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";



const router =
    express.Router();



/*
|--------------------------------------------------------------------------
| Protect All Analytics Routes
|--------------------------------------------------------------------------
| OWNER / DEVELOPER ONLY
|--------------------------------------------------------------------------
*/

router.use(

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    )
);





/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

router.get(

    "/dashboard-summary",

    getDashboardSummaryController
);





/*
|--------------------------------------------------------------------------
| Revenue Analytics
|--------------------------------------------------------------------------
*/

router.get(

    "/revenue",

    getRevenueAnalyticsController
);





/*
|--------------------------------------------------------------------------
| Appointment Analytics
|--------------------------------------------------------------------------
*/

router.get(

    "/appointments",

    getAppointmentAnalyticsController
);





/*
|--------------------------------------------------------------------------
| Top Selling Products
|--------------------------------------------------------------------------
*/

router.get(

    "/top-products",

    getTopSellingProductsController
);





/*
|--------------------------------------------------------------------------
| Doctor Analytics
|--------------------------------------------------------------------------
*/

router.get(

    "/doctors",

    getDoctorAnalyticsController
);



export default router;