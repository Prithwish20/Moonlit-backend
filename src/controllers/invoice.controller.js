import invoiceModel from "../models/invoice.model.js";

import orderModel from "../models/order.model.js";

import {

    createInvoiceService

} from "../services/invoice.service.js";


/*
|--------------------------------------------------------------------------
| Generate Invoice Number
|--------------------------------------------------------------------------
*/

const generateInvoiceNumber = () => {

    const date = new Date();



    const yyyy =
        date.getFullYear();



    const mm =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");



    const dd =
        String(
            date.getDate()
        ).padStart(2, "0");



    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );



    return `INV-${yyyy}${mm}${dd}-${random}`;
};





/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/




/*
|--------------------------------------------------------------------------
| Create Invoice
|--------------------------------------------------------------------------
*/

export const createInvoiceController =
async (req, res) => {

    try {

        const { orderId } =
            req.params;



        /*
        |--------------------------------------------------------------------------
        | Service
        |--------------------------------------------------------------------------
        */

        const invoice =
            await createInvoiceService(
                orderId
            );



        return res.status(201).json({

            success: true,

            message:
                "Invoice created successfully",

            invoice
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
| Get Single Invoice
|--------------------------------------------------------------------------
*/

export const getSingleInvoiceController = async (req, res) => {

    try {

        const { invoiceId } =
            req.params;



        const invoice =
            await invoiceModel

                .findById(invoiceId)

                .populate({

                    path: "order"
                })

                .populate({

                    path: "user",

                    select:
                        "name email"
                });



        if (!invoice) {

            return res.status(404).json({

                success: false,

                message:
                    "Invoice not found"
            });
        }



        return res.status(200).json({

            success: true,

            invoice
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
| Get My Invoices
|--------------------------------------------------------------------------
*/

export const getMyInvoicesController = async (req, res) => {

    try {

        const userId =
            req.user.id;



        const invoices =
            await invoiceModel

                .find({

                    user: userId
                })

                .sort({
                    createdAt: -1
                });



        return res.status(200).json({

            success: true,

            total:
                invoices.length,

            invoices
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
| Delete Invoice
|--------------------------------------------------------------------------
| DEVELOPER ONLY
|--------------------------------------------------------------------------
*/

export const deleteInvoiceController = async (req, res) => {

    try {

        const { invoiceId } =
            req.params;



        const invoice =
            await invoiceModel.findById(
                invoiceId
            );



        if (!invoice) {

            return res.status(404).json({

                success: false,

                message:
                    "Invoice not found"
            });
        }



        await invoice.deleteOne();



        return res.status(200).json({

            success: true,

            message:
                "Invoice deleted successfully"
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