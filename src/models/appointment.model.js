import mongoose from "mongoose";



/*
|--------------------------------------------------------------------------
| Appointment Schema
|--------------------------------------------------------------------------
*/

const appointmentSchema =
new mongoose.Schema({

    /*
    |--------------------------------------------------------------------------
    | Appointment Code
    |--------------------------------------------------------------------------
    */

    appointmentCode: {

        type: String,

        required: true,

        unique: true
    },



    /*
    |--------------------------------------------------------------------------
    | Patient / User
    |--------------------------------------------------------------------------
    */

    user: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "users",

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Doctor
    |--------------------------------------------------------------------------
    */

    doctor: {

        type: mongoose.Schema.Types.ObjectId,

        ref: "doctors",

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Appointment Date
    |--------------------------------------------------------------------------
    */

    appointmentDate: {

        type: Date,

        required: true
    },



    /*
    |--------------------------------------------------------------------------
    | Slot Information
    |--------------------------------------------------------------------------
    */

    slot: {

        startTime: {

            type: String,

            required: true
        },



        endTime: {

            type: String,

            required: true
        }
    },



    /*
    |--------------------------------------------------------------------------
    | Patient Information Snapshot
    |--------------------------------------------------------------------------
    */

    patientName: {

        type: String,

        required: true
    },



    patientPhone: {

        type: String
    },



    patientEmail: {

        type: String
    },



    /*
    |--------------------------------------------------------------------------
    | Appointment Pricing
    |--------------------------------------------------------------------------
    */

    consultationFee: {

        type: Number,

        required: true,

        min: 0
    },



    discountAmount: {

        type: Number,

        default: 0,

        min: 0
    },



    finalAmount: {

        type: Number,

        required: true,

        min: 0
    },



    /*
    |--------------------------------------------------------------------------
    | Payment
    |--------------------------------------------------------------------------
    */

    paymentStatus: {

        type: String,

        enum: [

            "PENDING",

            "PARTIAL",

            "PAID"
        ],

        default: "PENDING"
    },



    paidAmount: {

        type: Number,

        default: 0,

        min: 0
    },



    dueAmount: {

        type: Number,

        default: 0,

        min: 0
    },



    paymentMethod: {

        type: String,

        enum: [

            "CASH",

            "CARD",

            "UPI",

            "BANK_TRANSFER"
        ]
    },



    /*
    |--------------------------------------------------------------------------
    | Appointment Status
    |--------------------------------------------------------------------------
    */

    appointmentStatus: {

        type: String,

        enum: [

            "PENDING",

            "CONFIRMED",

            "COMPLETED",

            "CANCELLED",

            "NO_SHOW"
        ],

        default: "PENDING"
    },



    /*
    |--------------------------------------------------------------------------
    | Prescription / Notes
    |--------------------------------------------------------------------------
    */

    symptoms: {

        type: String
    },



    notes: {

        type: String
    },



    /*
    |--------------------------------------------------------------------------
    | Booking Source
    |--------------------------------------------------------------------------
    */

    bookedBy: {

        type: String,

        enum: [

            "ONLINE",

            "SHOP"
        ],

        default: "ONLINE"
    },



    /*
    |--------------------------------------------------------------------------
    | Discount Eligibility
    |--------------------------------------------------------------------------
    */

    preBookingDiscountApplied: {

        type: Boolean,

        default: false
    },



    /*
    |--------------------------------------------------------------------------
    | Active Status
    |--------------------------------------------------------------------------
    */

    isActive: {

        type: Boolean,

        default: true
    }

}, {
    timestamps: true
});



/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

appointmentSchema.index({
    appointmentCode: 1
});

appointmentSchema.index({
    user: 1
});

appointmentSchema.index({
    doctor: 1
});

appointmentSchema.index({
    appointmentDate: 1
});

appointmentSchema.index({
    appointmentStatus: 1
});



/*
|--------------------------------------------------------------------------
| Prevent Double Booking
|--------------------------------------------------------------------------
*/

appointmentSchema.index({

    doctor: 1,

    appointmentDate: 1,

    "slot.startTime": 1,

    "slot.endTime": 1

}, {
    unique: true
});



/*
|--------------------------------------------------------------------------
| Export Model
|--------------------------------------------------------------------------
*/

const appointmentModel =
mongoose.model(
    "appointments",
    appointmentSchema
);



export default appointmentModel;