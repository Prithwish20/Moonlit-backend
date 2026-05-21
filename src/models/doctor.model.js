import mongoose from "mongoose";



/*
|--------------------------------------------------------------------------
| Doctor Schema
|--------------------------------------------------------------------------
*/

const doctorSchema = new mongoose.Schema({

    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    name: {

        type: String,

        required: [true, "Doctor name is required"],

        trim: true
    },



    specialization: {

        type: String,

        required: [true, "Specialization is required"],

        trim: true
    },



    qualification: {

        type: String,

        trim: true
    },



    experience: {

        type: Number,

        default: 0
    },



    bio: {

        type: String,

        trim: true
    },



    /*
    |--------------------------------------------------------------------------
    | Contact Information
    |--------------------------------------------------------------------------
    */

    phone: {

        type: String,

        trim: true
    },



    email: {

        type: String,

        trim: true,

        lowercase: true
    },



    /*
    |--------------------------------------------------------------------------
    | Doctor Profile
    |--------------------------------------------------------------------------
    */

    profileImage: {

        type: String
    },



    consultationFee: {

        type: Number,

        required: true,

        min: 0
    },



    /*
    |--------------------------------------------------------------------------
    | Availability
    |--------------------------------------------------------------------------
    */

    availableDays: [

        {

            type: String,

            enum: [

                "SUNDAY",

                "MONDAY",

                "TUESDAY",

                "WEDNESDAY",

                "THURSDAY",

                "FRIDAY",

                "SATURDAY"
            ]
        }
    ],



    /*
    |--------------------------------------------------------------------------
    | Time Slots
    |--------------------------------------------------------------------------
    */

    availableSlots: [

        {

            startTime: {

                type: String,

                required: true
            },



            endTime: {

                type: String,

                required: true
            }
        }
    ],



    /*
    |--------------------------------------------------------------------------
    | Appointment Settings
    |--------------------------------------------------------------------------
    */

    maxPatientsPerSlot: {

        type: Number,

        default: 1
    },



    allowPreBookingDiscount: {

        type: Boolean,

        default: false
    },



    preBookingDiscountPercentage: {

        type: Number,

        default: 0,

        min: 0,

        max: 100
    },



    /*
    |--------------------------------------------------------------------------
    | Status
    |--------------------------------------------------------------------------
    */

    isAvailable: {

        type: Boolean,

        default: true
    },



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

doctorSchema.index({
    name: 1
});

doctorSchema.index({
    specialization: 1
});

doctorSchema.index({
    isAvailable: 1
});

doctorSchema.index({
    isActive: 1
});



/*
|--------------------------------------------------------------------------
| Export Model
|--------------------------------------------------------------------------
*/

const doctorModel =
mongoose.model(
    "doctors",
    doctorSchema
);



export default doctorModel;