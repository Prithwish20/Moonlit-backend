import express from "express";

import {
    registerController,
    loginController,
    refreshTokenController,
    logoutController,
    verifyEmailController
} from "../controllers/auth.controller.js";

import {
    authorize,
    protect
} from "../middleware/auth.middleware.js";



const router = express.Router();



/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

// Register User
router.post(
    "/register",
    registerController
);


// Login User
router.post(
    "/login",
    loginController
);


// Refresh Access Token
router.post(
    "/refresh-token",
    refreshTokenController
);


// Verify Email OTP
router.post(
    "/verify-email",
    verifyEmailController
);




/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

// Logout User
router.post(
    "/logout",
    protect,
    logoutController
);


// Get Current Logged In User
router.get(
    "/me",
    protect,
    async (req, res) => {

        return res.status(200).json({

            success: true,

            user: req.user
        });
    }
);

router.get(
    "/owner-dashboard",
    protect,
    authorize("OWNER","DEVELOPER"),
    (req, res) => {
      res.json({
        success: true,
        message: "Owner Dashboard"
      });
    }
  );


export default router;