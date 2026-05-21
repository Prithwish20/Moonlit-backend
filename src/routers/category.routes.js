import express from "express";

import {

    createCategoryController,

    getCategoriesController,

    getSingleCategoryController,

    updateCategoryController,

    deleteCategoryController

} from "../controllers/category.controller.js";


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

// Get All Categories
router.get(
    "/",
    getCategoriesController
);


// Get Single Category
router.get(
    "/:slug",
    getSingleCategoryController
);




/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Create Category
router.post(
    "/",
    protect,
    authorize("OWNER", "DEVELOPER"),
    createCategoryController
);


// Update Category
router.patch(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    updateCategoryController
);


// Delete Category
router.delete(
    "/:id",
    protect,
    authorize("OWNER", "DEVELOPER"),
    deleteCategoryController
);



export default router;