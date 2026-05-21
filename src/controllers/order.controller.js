import cartModel from "../models/cart.model.js";

import orderModel from "../models/order.model.js";



/*
|--------------------------------------------------------------------------
| Generate Order Number
|--------------------------------------------------------------------------
*/

const generateOrderNumber = () => {

    const timestamp =
        Date.now().toString().slice(-6);

    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );

    return `ORD-${timestamp}-${random}`;
};





/*
|--------------------------------------------------------------------------
| Create Order / Checkout
|--------------------------------------------------------------------------
*/

export const createOrderController =
async (req, res) => {

    try {

        const userId =
            req.user.id;



        const {

            prescription,

            discountAmount = 0,

            taxAmount = 0,

            advanceAmount = 0,

            paymentMethod = "CASH",

            notes

        } = req.body;



        /*
        |--------------------------------------------------------------------------
        | Find User Cart
        |--------------------------------------------------------------------------
        */

        const cart =
            await cartModel.findOne({

                user: userId
            });



        if (
            !cart ||
            cart.items.length === 0
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Cart is empty"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Calculate Totals
        |--------------------------------------------------------------------------
        */

        const subtotal =
            cart.subtotal;



        const grandTotal =

            subtotal

            -

            Number(discountAmount)

            +

            Number(taxAmount);



        const paidAmount =
            Number(advanceAmount);



        const dueAmount =

            grandTotal -

            paidAmount;



        /*
        |--------------------------------------------------------------------------
        | Payment Status
        |--------------------------------------------------------------------------
        */

        let paymentStatus =
            "PENDING";


        if (paidAmount <= 0) {

            paymentStatus =
                "PENDING";
        }

        else if (
            paidAmount < grandTotal
        ) {

            paymentStatus =
                "PARTIAL";
        }

        else {

            paymentStatus =
                "PAID";
        }



        /*
        |--------------------------------------------------------------------------
        | Payment History
        |--------------------------------------------------------------------------
        */

        const paymentHistory = [];


        if (paidAmount > 0) {

            paymentHistory.push({

                amount:
                    paidAmount,

                method:
                    paymentMethod,

                note:
                    "Advance payment"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Create Order
        |--------------------------------------------------------------------------
        */

        const order =
            await orderModel.create({

                orderNumber:
                    generateOrderNumber(),



                user:
                    userId,



                items:
                    cart.items,



                prescription,



                subtotal,



                discountAmount,



                taxAmount,



                grandTotal,



                paidAmount,



                dueAmount,



                paymentStatus,



                paymentHistory,



                notes
            });



        /*
        |--------------------------------------------------------------------------
        | Clear Cart After Checkout
        |--------------------------------------------------------------------------
        */

        cart.items = [];

        cart.subtotal = 0;

        cart.totalItems = 0;

        await cart.save();



        /*
        |--------------------------------------------------------------------------
        | Return Response
        |--------------------------------------------------------------------------
        */

        return res.status(201).json({

            success: true,

            message:
                "Order created successfully",

            order
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
| Get User Orders
|--------------------------------------------------------------------------
*/

export const getMyOrdersController =
async (req, res) => {

    try {

        const userId =
            req.user.id;



        const orders =
            await orderModel

                .find({
                    user: userId
                })

                .sort({
                    createdAt: -1
                });



        return res.status(200).json({

            success: true,

            total:
                orders.length,

            orders
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
| Get Single Order
|--------------------------------------------------------------------------
*/

export const getSingleOrderController =
async (req, res) => {

    try {

        const userId =
            req.user.id;

        const { orderId } =
            req.params;



        const order =
            await orderModel.findOne({

                _id: orderId,

                user: userId
            });



        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }



        return res.status(200).json({

            success: true,

            order
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
| Update Order Status
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const updateOrderStatusController =
async (req, res) => {

    try {

        const { orderId } =
            req.params;

        const {
            orderStatus
        } = req.body;



        const order =
            await orderModel.findById(
                orderId
            );


        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }



        order.orderStatus =
            orderStatus;



        await order.save();



        return res.status(200).json({

            success: true,

            message:
                "Order status updated",

            order
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
| Add Payment To Existing Order
|--------------------------------------------------------------------------
*/

export const addPaymentController =
async (req, res) => {

    try {

        const { orderId } =
            req.params;



        const {

            amount,

            method,

            note

        } = req.body;



        const order =
            await orderModel.findById(
                orderId
            );



        if (!order) {

            return res.status(404).json({

                success: false,

                message:
                    "Order not found"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Add Payment History
        |--------------------------------------------------------------------------
        */

        order.paymentHistory.push({

            amount,

            method,

            note
        });



        /*
        |--------------------------------------------------------------------------
        | Update Payment Amount
        |--------------------------------------------------------------------------
        */

        order.paidAmount +=
            Number(amount);



        order.dueAmount =

            order.grandTotal

            -

            order.paidAmount;



        /*
        |--------------------------------------------------------------------------
        | Update Payment Status
        |--------------------------------------------------------------------------
        */

        if (
            order.paidAmount <= 0
        ) {

            order.paymentStatus =
                "PENDING";
        }

        else if (

            order.paidAmount

            <

            order.grandTotal
        ) {

            order.paymentStatus =
                "PARTIAL";
        }

        else {

            order.paymentStatus =
                "PAID";
        }



        await order.save();



        return res.status(200).json({

            success: true,

            message:
                "Payment added successfully",

            order
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