import express from "express";

import {

    createBrandController,

    getBrandsController,

    getSingleBrandController,

    updateBrandController,

    deleteBrandController

} from "../controllers/brand.controller.js";


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

// Get All Brands
router.get(
    "/",
    getBrandsController
);


// Get Single Brand
router.get(
    "/:id",
    getSingleBrandController
);




/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Create Brand
router.post(
    "/",
    protect,
    authorize("OWNER", "DEVELOPER"),
    createBrandController
);


// Update Brand
router.patch(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    updateBrandController
);


// Delete Brand
router.delete(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    deleteBrandController
);



export default router;