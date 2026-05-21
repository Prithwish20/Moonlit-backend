import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";


 
/*
|--------------------------------------------------------------------------
| Protect Middleware
|--------------------------------------------------------------------------
| Verifies access token
| Attaches user info to req.user
|--------------------------------------------------------------------------
*/

export const protect = async (req, res, next) => {

    try {

        let token;


        /*
        |--------------------------------------------------------------------------
        | Get Token
        |--------------------------------------------------------------------------
        */

        const authHeader =
            req.headers.authorization;


        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {

            token = authHeader.split(" ")[1];
        }


        if (!token) {

            return res.status(401).json({
                success: false,
                message: "Unauthorized"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Token
        |--------------------------------------------------------------------------
        */

        const decoded = jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET
        );


        /*
        |--------------------------------------------------------------------------
        | Find User
        |--------------------------------------------------------------------------
        */

        const user =
            await userModel
                .findById(decoded.id)
                .select("-password");


        if (!user) {

            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Check User Status
        |--------------------------------------------------------------------------
        */

        if (user.isBlocked) {

            return res.status(403).json({
                success: false,
                message: "Account blocked"
            });
        }


        if (!user.verified) {

            return res.status(403).json({
                success: false,
                message: "Email not verified"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Attach User To Request
        |--------------------------------------------------------------------------
        */

        req.user = user;


        next();

    } catch (error) {

        console.log(error);


        /*
        |--------------------------------------------------------------------------
        | JWT Errors
        |--------------------------------------------------------------------------
        */

        if (error.name === "TokenExpiredError") {

            return res.status(401).json({
                success: false,
                message: "Access token expired"
            });
        }


        if (error.name === "JsonWebTokenError") {

            return res.status(401).json({
                success: false,
                message: "Invalid access token"
            });
        }


        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};




/*
|--------------------------------------------------------------------------
| Role Authorization Middleware
|--------------------------------------------------------------------------
| Example:
| authorize("OWNER", "DEVELOPER")
|--------------------------------------------------------------------------
*/

export const authorize = (...roles) => {

    return (req, res, next) => {

        try {
            
            if (!req.user) {

                return res.status(401).json({
                    success: false,
                    message: "Unauthorized"
                });
            }
            

            if (!roles.includes(req.user.role)) {

                return res.status(403).json({
                    success: false,
                    message: "Forbidden"
                });
            }


            next();

        } catch (error) {

            console.log(error);

            return res.status(500).json({
                success: false,
                message: "Internal server error"
            });
        }
    };
};