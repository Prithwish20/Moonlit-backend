import appointmentModel from "../models/appointment.model.js";

import doctorModel from "../models/doctor.model.js";



/*
|--------------------------------------------------------------------------
| Generate Appointment Code
|--------------------------------------------------------------------------
*/

const generateAppointmentCode = () => {

    const random =
        Math.floor(
            1000 + Math.random() * 9000
        );



    return `APT-${random}`;
};






/*
|--------------------------------------------------------------------------
| Create Appointment
|--------------------------------------------------------------------------
*/

export const createAppointmentController =
async (req, res) => {

    try {

        const {

            doctorId,

            appointmentDate,

            slot,

            symptoms,

            paymentMethod,

            paidAmount = 0

        } = req.body;



        /*
        |--------------------------------------------------------------------------
        | User
        |--------------------------------------------------------------------------
        */

        const user =
            req.user;



        /*
        |--------------------------------------------------------------------------
        | Validate Doctor
        |--------------------------------------------------------------------------
        */

        const doctor =
            await doctorModel.findById(
                doctorId
            );



        if (!doctor) {

            return res.status(404).json({

                success: false,

                message:
                    "Doctor not found"
            });
        }



        if (!doctor.isAvailable) {

            return res.status(400).json({

                success: false,

                message:
                    "Doctor is currently unavailable"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Double Booking Check
        |--------------------------------------------------------------------------
        */

        const existingAppointment =
            await appointmentModel.findOne({

                doctor: doctorId,

                appointmentDate,

                "slot.startTime":
                    slot.startTime,

                "slot.endTime":
                    slot.endTime
            });



        if (existingAppointment) {

            return res.status(400).json({

                success: false,

                message:
                    "This slot is already booked"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Consultation Fee
        |--------------------------------------------------------------------------
        */

        let consultationFee =
            doctor.consultationFee;



        /*
        |--------------------------------------------------------------------------
        | Pre Booking Discount
        |--------------------------------------------------------------------------
        */

        let discountAmount = 0;

        let preBookingDiscountApplied = false;



        const appointmentDay =
            new Date(appointmentDate);



        const today =
            new Date();



        const diffTime =
            appointmentDay - today;



        const diffDays =
            Math.ceil(
                diffTime /
                (1000 * 60 * 60 * 24)
            );



        /*
        |--------------------------------------------------------------------------
        | Apply Discount
        |--------------------------------------------------------------------------
        */

        if (

            doctor.allowPreBookingDiscount &&

            diffDays >= 2

        ) {

            discountAmount =

                (
                    consultationFee *

                    doctor.preBookingDiscountPercentage
                ) / 100;



            preBookingDiscountApplied = true;
        }



        /*
        |--------------------------------------------------------------------------
        | Final Amount
        |--------------------------------------------------------------------------
        */

        const finalAmount =
            consultationFee -
            discountAmount;



        /*
        |--------------------------------------------------------------------------
        | Due Amount
        |--------------------------------------------------------------------------
        */

        const dueAmount =
            finalAmount - paidAmount;



        /*
        |--------------------------------------------------------------------------
        | Payment Status
        |--------------------------------------------------------------------------
        */

        let paymentStatus =
            "PENDING";



        if (paidAmount === finalAmount) {

            paymentStatus = "PAID";
        }

        else if (paidAmount > 0) {

            paymentStatus = "PARTIAL";
        }



        /*
        |--------------------------------------------------------------------------
        | Create Appointment
        |--------------------------------------------------------------------------
        */

        const appointment =
            await appointmentModel.create({

                appointmentCode:
                    generateAppointmentCode(),

                user:
                    user._id,

                doctor:
                    doctor._id,

                appointmentDate,

                slot,

                patientName:
                    user.name,

                patientPhone:
                    user.phone,

                patientEmail:
                    user.email,

                consultationFee,

                discountAmount,

                finalAmount,

                paymentStatus,

                paidAmount,

                dueAmount,

                paymentMethod,

                symptoms,

                preBookingDiscountApplied
            });



        /*
        |--------------------------------------------------------------------------
        | Populate
        |--------------------------------------------------------------------------
        */

        await appointment.populate([

            {

                path: "user",

                select:
                    "name email phone"
            },

            {

                path: "doctor",

                select:
                    "name specialization"
            }
        ]);



        return res.status(201).json({

            success: true,

            message:
                "Appointment booked successfully",

            appointment
        });

    } catch (error) {

        console.log(error);



        /*
        |--------------------------------------------------------------------------
        | Duplicate Booking Error
        |--------------------------------------------------------------------------
        */

        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "This slot is already booked"
            });
        }



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
| Get My Appointments
|--------------------------------------------------------------------------
*/

export const getMyAppointmentsController =
async (req, res) => {

    try {

        const appointments =
            await appointmentModel

                .find({

                    user:
                        req.user._id
                })

                .populate({

                    path: "doctor",

                    select:
                        "name specialization consultationFee"
                })

                .sort({
                    appointmentDate: -1
                });



        return res.status(200).json({

            success: true,

            total:
                appointments.length,

            appointments
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
| Get All Appointments
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const getAllAppointmentsController =
async (req, res) => {

    try {

        const page =
            Number(req.query.page) || 1;



        const limit =
            Number(req.query.limit) || 10;



        const skip =
            (page - 1) * limit;



        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        const filters = {};



        if (req.query.status) {

            filters.appointmentStatus =
                req.query.status;
        }



        if (req.query.paymentStatus) {

            filters.paymentStatus =
                req.query.paymentStatus;
        }



        /*
        |--------------------------------------------------------------------------
        | Fetch
        |--------------------------------------------------------------------------
        */

        const appointments =
            await appointmentModel

                .find(filters)

                .populate({

                    path: "user",

                    select:
                        "name email phone"
                })

                .populate({

                    path: "doctor",

                    select:
                        "name specialization"
                })

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limit);



        const total =
            await appointmentModel.countDocuments(
                filters
            );



        return res.status(200).json({

            success: true,

            total,

            currentPage: page,

            totalPages:
                Math.ceil(total / limit),

            appointments
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
| Update Appointment Status
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const updateAppointmentStatusController =
async (req, res) => {

    try {

        const { appointmentId } =
            req.params;



        const {

            appointmentStatus

        } = req.body;



        const appointment =
            await appointmentModel.findById(
                appointmentId
            );



        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"
            });
        }



        appointment.appointmentStatus =
            appointmentStatus;



        await appointment.save();



        return res.status(200).json({

            success: true,

            message:
                "Appointment status updated successfully",

            appointment
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
| Cancel Appointment
|--------------------------------------------------------------------------
*/

export const cancelAppointmentController =
async (req, res) => {

    try {

        const { appointmentId } =
            req.params;



        const appointment =
            await appointmentModel.findById(
                appointmentId
            );



        if (!appointment) {

            return res.status(404).json({

                success: false,

                message:
                    "Appointment not found"
            });
        }



        /*
        |--------------------------------------------------------------------------
        | Ownership Check
        |--------------------------------------------------------------------------
        */

        if (

            appointment.user.toString()

            !==

            req.user._id.toString()

        ) {

            return res.status(403).json({

                success: false,

                message:
                    "Unauthorized access"
            });
        }



        appointment.appointmentStatus =
            "CANCELLED";



        await appointment.save();



        return res.status(200).json({

            success: true,

            message:
                "Appointment cancelled successfully"
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