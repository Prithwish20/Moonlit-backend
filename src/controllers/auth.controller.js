import crypto from "crypto";
import jwt from "jsonwebtoken";

import userModel from "../models/user.model.js";
import sessionModel from "../models/session.model.js";
import otpModel from "../models/otp.model.js";



/*
|--------------------------------------------------------------------------
| Utility Functions
|--------------------------------------------------------------------------
*/

const generateAccessToken = (user) => {

    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );
};



const generateRefreshToken = (user) => {

    return jwt.sign(
        {
            id: user._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
};



const hashToken = (token) => {

    return crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");
};



/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

export const registerController = async (req, res) => {

    try {

        const {
            name,
            email,
            password,
            phone
        } = req.body;
        console.log(req.body);

        const existingUser = await userModel.findOne({
            email
        });


        if (existingUser) {

            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }


        const user = await userModel.create({
            name,
            email,
            password,
            phone
        });


        /*
        |--------------------------------------------------------------------------
        | Generate OTP
        |--------------------------------------------------------------------------
        */

        const otp = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const otpHash = hashToken(otp);


        await otpModel.create({

            email: user.email,

            user: user._id,

            otpHash,

            purpose: "EMAIL_VERIFICATION",

            expiresAt:
                new Date(Date.now() + 10 * 60 * 1000)
        });


        /*
        |--------------------------------------------------------------------------
        | TODO:
        | Send OTP Email using Nodemailer
        |--------------------------------------------------------------------------
        */


        return res.status(201).json({
            success: true,
            otp, // For testing purposes, remove in production
            message:
                "Registration successful. Verify your email."
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



/*
|--------------------------------------------------------------------------
| Login
|--------------------------------------------------------------------------
*/

export const loginController = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;


        const user = await userModel.findOne({
            email
        });


        if (!user) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        const isPasswordMatched =
            await user.comparePassword(password);


        if (!isPasswordMatched) {

            return res.status(400).json({
                success: false,
                message: "Invalid credentials"
            });
        }


        if (!user.verified) {

            return res.status(403).json({
                success: false,
                message: "Email not verified"
            });
        }


        if (user.isBlocked) {

            return res.status(403).json({
                success: false,
                message: "Account blocked"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Generate Tokens
        |--------------------------------------------------------------------------
        */

        const accessToken =
            generateAccessToken(user);
        //console.log("accessToken", accessToken);
        const refreshToken =
            generateRefreshToken(user);
        //console.log("refreshToken", refreshToken);
        const refreshTokenHash =
            hashToken(refreshToken);

        //console.log("refreshTokenHash", refreshTokenHash);
        /*
        |--------------------------------------------------------------------------
        | Create Session
        |--------------------------------------------------------------------------
        */

        await sessionModel.create({

            user: user._id,

            refreshTokenHash,

            ip: req.ip,

            userAgent: req.headers["user-agent"],

            expiresAt:
                new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        });


        /*
        |--------------------------------------------------------------------------
        | Set Cookie
        |--------------------------------------------------------------------------
        */

        res.cookie("refreshToken", refreshToken, {

            httpOnly: true,

            secure: false,

            sameSite: "lax",

            maxAge:
                7 * 24 * 60 * 60 * 1000
        });


        return res.status(200).json({

            success: true,

            message: "Login successful",

            accessToken,

            user: {

                id: user._id,

                name: user.name,

                email: user.email,

                role: user.role
            }
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



/*
|--------------------------------------------------------------------------
| Refresh Access Token
|--------------------------------------------------------------------------
*/

export const refreshTokenController =
async (req, res) => {

    try {

        const refreshToken =
            req.cookies.refreshToken;


        if (!refreshToken) {

            return res.status(401).json({
                success: false,
                message: "Refresh token missing"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Verify Refresh Token
        |--------------------------------------------------------------------------
        */

        let decoded;

        try {

            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );

        } catch (error) {

            return res.status(401).json({
                success: false,
                message: "Invalid refresh token"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Check Session
        |--------------------------------------------------------------------------
        */

        const refreshTokenHash =
            hashToken(refreshToken);


        const session =
            await sessionModel.findOne({

                user: decoded.id,

                refreshTokenHash,

                revoked: false
            });


        if (!session) {

            return res.status(401).json({
                success: false,
                message: "Session expired"
            });
        }


        /*
        |--------------------------------------------------------------------------
        | Generate New Access Token
        |--------------------------------------------------------------------------
        */

        const user =
            await userModel.findById(decoded.id);


        const newAccessToken =
            generateAccessToken(user);


        session.lastUsedAt = new Date();

        await session.save();


        return res.status(200).json({

            success: true,

            accessToken: newAccessToken
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



/*
|--------------------------------------------------------------------------
| Logout
|--------------------------------------------------------------------------
*/

export const logoutController =
async (req, res) => {

    try {

        const refreshToken =
            req.cookies.refreshToken;


        if (refreshToken) {

            const refreshTokenHash =
                hashToken(refreshToken);


            await sessionModel.findOneAndUpdate(
                {
                    refreshTokenHash
                },
                {
                    revoked: true
                }
            );
        }


        res.clearCookie("refreshToken");


        return res.status(200).json({

            success: true,

            message: "Logout successful"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};



/*
|--------------------------------------------------------------------------
| Verify Email OTP
|--------------------------------------------------------------------------
*/

export const verifyEmailController =
async (req, res) => {

    try {

        const {
            email,
            otp
        } = req.body;


        const user =
            await userModel.findOne({ email });


        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }


        const otpData =
            await otpModel.findOne({

                email,

                user: user._id,

                purpose: "EMAIL_VERIFICATION"
            });


        if (!otpData) {

            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }


        const hashedOtp = hashToken(otp);


        if (hashedOtp !== otpData.otpHash) {

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }


        user.verified = true;

        await user.save();


        await otpModel.deleteMany({
            user: user._id
        });


        return res.status(200).json({

            success: true,

            message: "Email verified successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};