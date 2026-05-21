import mongoose from "mongoose";



/*
|--------------------------------------------------------------------------
| Order Item Schema
|--------------------------------------------------------------------------
*/

const orderItemSchema = new mongoose.Schema({

    /*
    |--------------------------------------------------------------------------
    | Product Reference
    |--------------------------------------------------------------------------
    */

    product: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "products",

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Product Snapshot
    |--------------------------------------------------------------------------
    */

    title: {

        type: String,

        required: true
    },

    thumbnail: {
        type: String
    },



    /*
    |--------------------------------------------------------------------------
    | Selected Variant
    |--------------------------------------------------------------------------
    */

    variant: {

        id: mongoose.Schema.Types.ObjectId,

        color: String,

        size: String,

        sku: String
    },



    /*
    |--------------------------------------------------------------------------
    | Selected Lens
    |--------------------------------------------------------------------------
    */

    lensOption: {

        id: mongoose.Schema.Types.ObjectId,

        name: String
    },



    /*
    |--------------------------------------------------------------------------
    | Prescription Power
    |--------------------------------------------------------------------------
    */

    power: {
        type: Number
    },



    /*
    |--------------------------------------------------------------------------
    | Quantity
    |--------------------------------------------------------------------------
    */

    quantity: {

        type: Number,

        required: true,

        min: 1
    },



    /*
    |--------------------------------------------------------------------------
    | Pricing Snapshot
    |--------------------------------------------------------------------------
    */

    basePrice: {

        type: Number,

        required: true
    },

    variantPrice: {

        type: Number,

        default: 0
    },

    lensPrice: {

        type: Number,

        default: 0
    },

    powerPrice: {

        type: Number,

        default: 0
    },



    /*
    |--------------------------------------------------------------------------
    | Final Price Per Item
    |--------------------------------------------------------------------------
    */

    finalPrice: {

        type: Number,

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Total Price
    |--------------------------------------------------------------------------
    */

    totalPrice: {

        type: Number,

        required: true
    }

}, {
    _id: true
});



/*
|--------------------------------------------------------------------------
| Prescription Schema
|--------------------------------------------------------------------------
| Future scalable optical prescription
|--------------------------------------------------------------------------
*/

const prescriptionSchema = new mongoose.Schema({

    leftEye: {

        sph: Number,

        cyl: Number,

        axis: Number,

        add: Number
    },



    rightEye: {

        sph: Number,

        cyl: Number,

        axis: Number,

        add: Number
    },



    pd: Number,



    notes: String

}, {
    _id: false
});



/*
|--------------------------------------------------------------------------
| Payment History Schema
|--------------------------------------------------------------------------
*/

const paymentHistorySchema = new mongoose.Schema({

    amount: {

        type: Number,

        required: true
    },



    method: {

        type: String,

        enum: [

            "CASH",

            "CARD",

            "UPI",

            "BANK_TRANSFER"
        ],

        required: true
    },



    note: {
        type: String
    },



    paidAt: {

        type: Date,

        default: Date.now
    }

}, {
    _id: true
});



/*
|--------------------------------------------------------------------------
| Order Schema
|--------------------------------------------------------------------------
*/

const orderSchema = new mongoose.Schema({

    /*
    |--------------------------------------------------------------------------
    | Order Number
    |--------------------------------------------------------------------------
    */

    orderNumber: {

        type: String,

        required: true,

        unique: true
    },



    /*
    |--------------------------------------------------------------------------
    | User
    |--------------------------------------------------------------------------
    */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Ordered Items
    |--------------------------------------------------------------------------
    */

    items: [orderItemSchema],



    /*
    |--------------------------------------------------------------------------
    | Prescription
    |--------------------------------------------------------------------------
    */

    prescription:
        prescriptionSchema,



    /*
    |--------------------------------------------------------------------------
    | Pricing Summary
    |--------------------------------------------------------------------------
    */

    subtotal: {

        type: Number,

        required: true
    },



    discountAmount: {

        type: Number,

        default: 0
    },



    taxAmount: {

        type: Number,

        default: 0
    },



    grandTotal: {

        type: Number,

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Payment Tracking
    |--------------------------------------------------------------------------
    */

    paidAmount: {

        type: Number,

        default: 0
    },



    dueAmount: {

        type: Number,

        required: true
    },



    paymentStatus: {

        type: String,

        enum: [

            "PENDING",

            "PARTIAL",

            "PAID",

            "FAILED",

            "REFUNDED"
        ],

        default: "PENDING"
    },



    paymentHistory:
        [paymentHistorySchema],



    /*
    |--------------------------------------------------------------------------
    | Order Status
    |--------------------------------------------------------------------------
    */

    orderStatus: {

        type: String,

        enum: [

            "PENDING",

            "CONFIRMED",

            "PROCESSING",

            "READY",

            "DELIVERED",

            "CANCELLED"
        ],

        default: "PENDING"
    },



    /*
    |--------------------------------------------------------------------------
    | Delivery Information
    |--------------------------------------------------------------------------
    */

    deliveryDate: Date,



    notes: String,



    /*
    |--------------------------------------------------------------------------
    | Invoice
    |--------------------------------------------------------------------------
    */

    invoiceSent: {

        type: Boolean,

        default: false
    }

}, {
    timestamps: true
});



/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

orderSchema.index({
    user: 1
});

orderSchema.index({
    orderStatus: 1
});

orderSchema.index({
    paymentStatus: 1
});

orderSchema.index({
    createdAt: -1
});



/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const orderModel =
mongoose.model(
    "orders",
    orderSchema
);

export default orderModel;