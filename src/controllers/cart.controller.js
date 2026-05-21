import cartModel from "../models/cart.model.js";

import productModel from "../models/product.model.js";

import {
    calculateFinalPrice
} from "../services/pricing.service.js";



/*
|--------------------------------------------------------------------------
| Add To Cart
|--------------------------------------------------------------------------
*/

export const addToCartController =
async (req, res) => {

    try {

        const userId = req.user.id;


        const {

            productId,

            variantId,

            lensOptionId,

            power,

            quantity = 1

        } = req.body;



        /*
        |--------------------------------------------------------------------------
        | Validate Product
        |--------------------------------------------------------------------------
        */

        const product =
            await productModel.findById(
                productId
            );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Calculate Price
        |--------------------------------------------------------------------------
        */

        const pricing =
            await calculateFinalPrice({

                productId,

                variantId,

                lensOptionId,

                power
            });



        /*
        |--------------------------------------------------------------------------
        | Find Cart
        |--------------------------------------------------------------------------
        */

        let cart =
            await cartModel.findOne({

                user: userId
            });



        /*
        |--------------------------------------------------------------------------
        | Create Cart If Not Exists
        |--------------------------------------------------------------------------
        */

        if (!cart) {

            cart =
                await cartModel.create({

                    user: userId,

                    items: []
                });
        }



        /*
        |--------------------------------------------------------------------------
        | Check Existing Item
        |--------------------------------------------------------------------------
        */

        const existingItemIndex =
            cart.items.findIndex((item) => {

                return (

                    item.product.toString() ===
                    productId

                    &&

                    String(item?.variant?.id || "")
                    ===
                    String(variantId || "")

                    &&

                    String(item?.lensOption?.id || "")
                    ===
                    String(lensOptionId || "")

                    &&

                    Number(item?.power || 0)
                    ===
                    Number(power || 0)
                );
            });



        /*
        |--------------------------------------------------------------------------
        | Existing Item → Increase Quantity
        |--------------------------------------------------------------------------
        */

        if (existingItemIndex > -1) {

            cart.items[
                existingItemIndex
            ].quantity += Number(quantity);



            cart.items[
                existingItemIndex
            ].totalPrice =

                cart.items[
                    existingItemIndex
                ].quantity

                *

                cart.items[
                    existingItemIndex
                ].finalPrice;
        }



        /*
        |--------------------------------------------------------------------------
        | New Item
        |--------------------------------------------------------------------------
        */

        else {

            cart.items.push({

                /*
                |--------------------------------------------------------------------------
                | Product Reference
                |--------------------------------------------------------------------------
                */

                product:
                    product._id,



                /*
                |--------------------------------------------------------------------------
                | Product Snapshot
                |--------------------------------------------------------------------------
                */

                title:
                    product.title,

                thumbnail:
                    product.thumbnail,



                /*
                |--------------------------------------------------------------------------
                | Variant Snapshot
                |--------------------------------------------------------------------------
                */

                variant:
                    pricing.variant,



                /*
                |--------------------------------------------------------------------------
                | Lens Snapshot
                |--------------------------------------------------------------------------
                */

                lensOption:
                    pricing.lensOption,



                /*
                |--------------------------------------------------------------------------
                | Power
                |--------------------------------------------------------------------------
                */

                power,



                /*
                |--------------------------------------------------------------------------
                | Quantity
                |--------------------------------------------------------------------------
                */

                quantity:
                    Number(quantity),



                /*
                |--------------------------------------------------------------------------
                | Pricing Snapshot
                |--------------------------------------------------------------------------
                */

                basePrice:
                    pricing.basePrice,

                variantPrice:
                    pricing.variantPrice,

                lensPrice:
                    pricing.lensPrice,

                powerPrice:
                    pricing.powerPrice,

                finalPrice:
                    pricing.finalPrice,



                /*
                |--------------------------------------------------------------------------
                | Total Price
                |--------------------------------------------------------------------------
                */

                totalPrice:

                    pricing.finalPrice *

                    Number(quantity)
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Recalculate Cart Summary
        |--------------------------------------------------------------------------
        */

        cart.subtotal =
            cart.items.reduce(

                (accumulator, item) =>

                    accumulator +
                    item.totalPrice,

                0
            );



        cart.totalItems =
            cart.items.reduce(

                (accumulator, item) =>

                    accumulator +
                    item.quantity,

                0
            );



        /*
        |--------------------------------------------------------------------------
        | Save Cart
        |--------------------------------------------------------------------------
        */

        await cart.save();



        return res.status(200).json({

            success: true,

            message:
                "Product added to cart",

            cart
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"
        });
    }
};





/*
|--------------------------------------------------------------------------
| Get Cart
|--------------------------------------------------------------------------
*/

export const getCartController =
async (req, res) => {

    try {

        const userId =
            req.user.id;



        const cart =
            await cartModel.findOne({

                user: userId
            });



        if (!cart) {

            return res.status(200).json({

                success: true,

                cart: null
            });
        }



        return res.status(200).json({

            success: true,

            cart
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"
        });
    }
};





/*
|--------------------------------------------------------------------------
| Remove Cart Item
|--------------------------------------------------------------------------
*/

export const removeCartItemController =
async (req, res) => {

    try {

        const userId =
            req.user.id;

        const { itemId } =
            req.params;



        const cart =
            await cartModel.findOne({

                user: userId
            });



        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Remove Item
        |--------------------------------------------------------------------------
        */

        cart.items =
            cart.items.filter(

                (item) =>

                    item._id.toString()
                    !==
                    itemId
            );



        /*
        |--------------------------------------------------------------------------
        | Recalculate Summary
        |--------------------------------------------------------------------------
        */

        cart.subtotal =
            cart.items.reduce(

                (accumulator, item) =>

                    accumulator +
                    item.totalPrice,

                0
            );



        cart.totalItems =
            cart.items.reduce(

                (accumulator, item) =>

                    accumulator +
                    item.quantity,

                0
            );



        await cart.save();



        return res.status(200).json({

            success: true,

            message:
                "Item removed from cart",

            cart
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"
        });
    }
};





/*
|--------------------------------------------------------------------------
| Clear Cart
|--------------------------------------------------------------------------
*/

export const clearCartController =
async (req, res) => {

    try {

        const userId =
            req.user.id;



        const cart =
            await cartModel.findOne({

                user: userId
            });



        if (!cart) {

            return res.status(404).json({

                success: false,

                message:
                    "Cart not found"
            });
        }



        cart.items = [];

        cart.subtotal = 0;

        cart.totalItems = 0;



        await cart.save();



        return res.status(200).json({

            success: true,

            message:
                "Cart cleared successfully",

            cart
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message:
                "Internal server error"
        });
    }
};