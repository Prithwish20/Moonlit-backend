import mongoose from "mongoose";

import orderModel from "../models/order.model.js";

import appointmentModel from "../models/appointment.model.js";

import productModel from "../models/product.model.js";



/*
|--------------------------------------------------------------------------
| Dashboard Summary Analytics
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getDashboardSummaryController =
async (req, res) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Dates
        |--------------------------------------------------------------------------
        */

        const today =
            new Date();



        const startOfToday =
            new Date(

                today.getFullYear(),

                today.getMonth(),

                today.getDate()
            );



        const startOfMonth =
            new Date(

                today.getFullYear(),

                today.getMonth(),

                1
            );



        /*
        |--------------------------------------------------------------------------
        | Total Revenue
        |--------------------------------------------------------------------------
        */

        const totalRevenueData =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "PAID"
                    }
                },

                {
                    $group: {

                        _id: null,

                        totalRevenue: {

                            $sum:
                                "$pricing.finalPrice"
                        }
                    }
                }
            ]);



        const totalRevenue =
            totalRevenueData[0]
                ?.totalRevenue || 0;



        /*
        |--------------------------------------------------------------------------
        | Today Revenue
        |--------------------------------------------------------------------------
        */

        const todayRevenueData =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "PAID",

                        createdAt: {
                            $gte:
                                startOfToday
                        }
                    }
                },

                {
                    $group: {

                        _id: null,

                        revenue: {

                            $sum:
                                "$pricing.finalPrice"
                        }
                    }
                }
            ]);



        const todayRevenue =
            todayRevenueData[0]
                ?.revenue || 0;



        /*
        |--------------------------------------------------------------------------
        | Monthly Revenue
        |--------------------------------------------------------------------------
        */

        const monthlyRevenueData =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "PAID",

                        createdAt: {
                            $gte:
                                startOfMonth
                        }
                    }
                },

                {
                    $group: {

                        _id: null,

                        revenue: {

                            $sum:
                                "$pricing.finalPrice"
                        }
                    }
                }
            ]);



        const monthlyRevenue =
            monthlyRevenueData[0]
                ?.revenue || 0;



        /*
        |--------------------------------------------------------------------------
        | Orders Analytics
        |--------------------------------------------------------------------------
        */

        const totalOrders =
            await orderModel.countDocuments();



        const completedOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "DELIVERED"
            });



        const pendingOrders =
            await orderModel.countDocuments({

                orderStatus:
                    "PENDING"
            });



        /*
        |--------------------------------------------------------------------------
        | Appointment Analytics
        |--------------------------------------------------------------------------
        */

        const totalAppointments =
            await appointmentModel.countDocuments();



        const todayAppointments =
            await appointmentModel.countDocuments({

                createdAt: {
                    $gte:
                        startOfToday
                }
            });



        const completedAppointments =
            await appointmentModel.countDocuments({

                appointmentStatus:
                    "COMPLETED"
            });



        const cancelledAppointments =
            await appointmentModel.countDocuments({

                appointmentStatus:
                    "CANCELLED"
            });



        /*
        |--------------------------------------------------------------------------
        | Pending Payments
        |--------------------------------------------------------------------------
        */

        const pendingPaymentData =
            await appointmentModel.aggregate([

                {
                    $match: {

                        paymentStatus: {

                            $in: [

                                "PENDING",

                                "PARTIAL"
                            ]
                        }
                    }
                },

                {
                    $group: {

                        _id: null,

                        dueAmount: {

                            $sum:
                                "$dueAmount"
                        }
                    }
                }
            ]);



        const pendingPayments =
            pendingPaymentData[0]
                ?.dueAmount || 0;



        /*
        |--------------------------------------------------------------------------
        | Product Analytics
        |--------------------------------------------------------------------------
        */

        const totalProducts =
            await productModel.countDocuments({

                isActive: true
            });



        const featuredProducts =
            await productModel.countDocuments({

                isFeatured: true,

                isActive: true
            });



        /*
        |--------------------------------------------------------------------------
        | Monthly Revenue Graph
        |--------------------------------------------------------------------------
        */

        const monthlyRevenueGraph =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "PAID"
                    }
                },

                {
                    $group: {

                        _id: {

                            month: {

                                $month:
                                    "$createdAt"
                            }
                        },

                        revenue: {

                            $sum:
                                "$pricing.finalPrice"
                        }
                    }
                },

                {
                    $sort: {
                        "_id.month": 1
                    }
                }
            ]);



        /*
        |--------------------------------------------------------------------------
        | Weekly Orders Graph
        |--------------------------------------------------------------------------
        */

        const weeklyOrdersGraph =
            await orderModel.aggregate([

                {
                    $group: {

                        _id: {

                            week: {

                                $week:
                                    "$createdAt"
                            }
                        },

                        orders: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        "_id.week": 1
                    }
                }
            ]);



        /*
        |--------------------------------------------------------------------------
        | Response
        |--------------------------------------------------------------------------
        */

        return res.status(200).json({

            success: true,

            analytics: {

                /*
                |--------------------------------------------------------------------------
                | Revenue
                |--------------------------------------------------------------------------
                */

                totalRevenue,

                todayRevenue,

                monthlyRevenue,



                /*
                |--------------------------------------------------------------------------
                | Orders
                |--------------------------------------------------------------------------
                */

                totalOrders,

                completedOrders,

                pendingOrders,



                /*
                |--------------------------------------------------------------------------
                | Appointments
                |--------------------------------------------------------------------------
                */

                totalAppointments,

                todayAppointments,

                completedAppointments,

                cancelledAppointments,



                /*
                |--------------------------------------------------------------------------
                | Payments
                |--------------------------------------------------------------------------
                */

                pendingPayments,



                /*
                |--------------------------------------------------------------------------
                | Products
                |--------------------------------------------------------------------------
                */

                totalProducts,

                featuredProducts,



                /*
                |--------------------------------------------------------------------------
                | Charts
                |--------------------------------------------------------------------------
                */

                monthlyRevenueGraph,

                weeklyOrdersGraph
            }
        });

    } catch (error) {

        console.log(error);



        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Internal server error"
        });
    }
};






/*
|--------------------------------------------------------------------------
| Revenue Analytics
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getRevenueAnalyticsController =
async (req, res) => {

    try {

        const revenue =
            await orderModel.aggregate([

                {
                    $match: {

                        paymentStatus:
                            "PAID"
                    }
                },

                {
                    $group: {

                        _id: {

                            year: {

                                $year:
                                    "$createdAt"
                            },

                            month: {

                                $month:
                                    "$createdAt"
                            }
                        },

                        revenue: {

                            $sum:
                                "$pricing.finalPrice"
                        },

                        orders: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {

                        "_id.year": 1,

                        "_id.month": 1
                    }
                }
            ]);



        return res.status(200).json({

            success: true,

            revenue
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
| Appointment Analytics
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getAppointmentAnalyticsController =
async (req, res) => {

    try {

        const analytics =
            await appointmentModel.aggregate([

                {
                    $group: {

                        _id:
                            "$appointmentStatus",

                        total: {
                            $sum: 1
                        }
                    }
                }
            ]);



        return res.status(200).json({

            success: true,

            analytics
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
| Top Selling Products
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getTopSellingProductsController =
async (req, res) => {

    try {

        const products =
            await orderModel.aggregate([

                {
                    $group: {

                        _id:
                            "$product",

                        totalSales: {
                            $sum: 1
                        }
                    }
                },

                {
                    $sort: {
                        totalSales: -1
                    }
                },

                {
                    $limit: 10
                },

                {
                    $lookup: {

                        from: "products",

                        localField: "_id",

                        foreignField: "_id",

                        as: "product"
                    }
                },

                {
                    $unwind:
                        "$product"
                }
            ]);



        return res.status(200).json({

            success: true,

            products
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
| Doctor Performance Analytics
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getDoctorAnalyticsController =
async (req, res) => {

    try {

        const doctors =
            await appointmentModel.aggregate([

                {
                    $group: {

                        _id:
                            "$doctor",

                        totalAppointments: {

                            $sum: 1
                        },

                        completedAppointments: {

                            $sum: {

                                $cond: [

                                    {

                                        $eq: [

                                            "$appointmentStatus",

                                            "COMPLETED"
                                        ]
                                    },

                                    1,

                                    0
                                ]
                            }
                        },

                        revenue: {

                            $sum:
                                "$paidAmount"
                        }
                    }
                },

                {
                    $sort: {
                        totalAppointments: -1
                    }
                },

                {
                    $lookup: {

                        from: "doctors",

                        localField: "_id",

                        foreignField: "_id",

                        as: "doctor"
                    }
                },

                {
                    $unwind:
                        "$doctor"
                }
            ]);



        return res.status(200).json({

            success: true,

            doctors
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