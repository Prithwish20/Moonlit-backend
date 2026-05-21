import cloudinary from "../config/cloudinary.js";

import invoiceModel from "../models/invoice.model.js";

import orderModel from "../models/order.model.js";

import generateInvoicePdf from "../utils/generateInvoicePdf.js";

import sendInvoiceEmail from "./sendInvoiceEmail.js";



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
| Create Invoice Service
|--------------------------------------------------------------------------
*/

export const createInvoiceService =
async (orderId) => {

    /*
    |--------------------------------------------------------------------------
    | Find Order
    |--------------------------------------------------------------------------
    */

    const order =
        await orderModel

            .findById(orderId)

            .populate({

                path: "user",

                select:
                    "name email"
            });



    if (!order) {

        throw new Error(
            "Order not found"
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Existing Invoice Check
    |--------------------------------------------------------------------------
    */

    const existingInvoice =
        await invoiceModel.findOne({

            order: orderId
        });



    if (existingInvoice) {

        throw new Error(
            "Invoice already exists"
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Create Invoice DB Record
    |--------------------------------------------------------------------------
    */

    const invoice =
        await invoiceModel.create({

            order:
                order._id,

            user:
                order.user._id,

            invoiceNumber:
                generateInvoiceNumber()
        });



    /*
    |--------------------------------------------------------------------------
    | Generate PDF
    |--------------------------------------------------------------------------
    */

    const pdfPath =
        await generateInvoicePdf({

            order,

            invoice
        });



    /*
    |--------------------------------------------------------------------------
    | Upload To Cloudinary
    |--------------------------------------------------------------------------
    */

    const uploadResult = await cloudinary.uploader.upload(
        pdfPath,
        {
            resource_type: "raw",
            folder: "moonlit-optics/invoices"
        }
    );


    /*
    |--------------------------------------------------------------------------
    | Save PDF URL
    |--------------------------------------------------------------------------
    */

    invoice.pdfUrl =
        uploadResult.secure_url;



    await invoice.save();



    /*
    |--------------------------------------------------------------------------
    | Send Email
    |--------------------------------------------------------------------------
    */

    await sendInvoiceEmail({

        customerEmail:
            order.user.email,

        customerName:
            order.user.name,

        invoiceNumber:
            invoice.invoiceNumber,

        pdfUrl:
            invoice.pdfUrl
    });



    /*
    |--------------------------------------------------------------------------
    | Update Invoice Status
    |--------------------------------------------------------------------------
    */

    invoice.sentToEmail = true;

    await invoice.save();



    return invoice;
};