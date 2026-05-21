import doctorModel from "../models/doctor.model.js";



/*
|--------------------------------------------------------------------------
| Create Doctor
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const createDoctorController =
async (req, res) => {

    try {

        const doctor =
            await doctorModel.create(
                req.body
            );



        return res.status(201).json({

            success: true,

            message:
                "Doctor created successfully",

            doctor
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
| Get All Doctors
|--------------------------------------------------------------------------
*/

export const getAllDoctorsController =
async (req, res) => {

    try {

        /*
        |--------------------------------------------------------------------------
        | Query Params
        |--------------------------------------------------------------------------
        */

        const page =
            Number(req.query.page) || 1;



        const limit =
            Number(req.query.limit) || 10;



        const skip =
            (page - 1) * limit;



        const search =
            req.query.search || "";



        const specialization =
            req.query.specialization || "";



        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        const filters = {

            isActive: true
        };



        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (search) {

            filters.name = {

                $regex: search,

                $options: "i"
            };
        }



        /*
        |--------------------------------------------------------------------------
        | Specialization Filter
        |--------------------------------------------------------------------------
        */

        if (specialization) {

            filters.specialization = {

                $regex: specialization,

                $options: "i"
            };
        }



        /*
        |--------------------------------------------------------------------------
        | Fetch Doctors
        |--------------------------------------------------------------------------
        */

        const doctors =
            await doctorModel

                .find(filters)

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(limit);



        const total =
            await doctorModel.countDocuments(
                filters
            );



        return res.status(200).json({

            success: true,

            total,

            currentPage: page,

            totalPages:
                Math.ceil(total / limit),

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






/*
|--------------------------------------------------------------------------
| Get Single Doctor
|--------------------------------------------------------------------------
*/

export const getSingleDoctorController =
async (req, res) => {

    try {

        const { doctorId } =
            req.params;



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



        return res.status(200).json({

            success: true,

            doctor
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
| Update Doctor
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const updateDoctorController =
async (req, res) => {

    try {

        const { doctorId } =
            req.params;



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



        const updatedDoctor =
            await doctorModel.findByIdAndUpdate(

                doctorId,

                req.body,

                {
                    new: true,

                    runValidators: true
                }
            );



        return res.status(200).json({

            success: true,

            message:
                "Doctor updated successfully",

            doctor:
                updatedDoctor
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
| Delete Doctor
|--------------------------------------------------------------------------
| DEVELOPER ONLY
|--------------------------------------------------------------------------
*/

export const deleteDoctorController =
async (req, res) => {

    try {

        const { doctorId } =
            req.params;



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



        await doctor.deleteOne();



        return res.status(200).json({

            success: true,

            message:
                "Doctor deleted successfully"
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
| Toggle Doctor Availability
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

export const toggleDoctorAvailabilityController =
async (req, res) => {

    try {

        const { doctorId } =
            req.params;



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



        doctor.isAvailable =
            !doctor.isAvailable;



        await doctor.save();



        return res.status(200).json({

            success: true,

            message:
                `Doctor is now ${
                    doctor.isAvailable
                        ? "available"
                        : "unavailable"
                }`,

            doctor
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