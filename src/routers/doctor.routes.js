import express from "express";

import {

    createDoctorController,

    getAllDoctorsController,

    getSingleDoctorController,

    updateDoctorController,

    deleteDoctorController,

    toggleDoctorAvailabilityController 

} from "../controllers/doctor.controller.js";


import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";



const router =
    express.Router();



/*
|--------------------------------------------------------------------------
| Create Doctor
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    createDoctorController
);





/*
|--------------------------------------------------------------------------
| Get All Doctors
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    getAllDoctorsController
);





/*
|--------------------------------------------------------------------------
| Get Single Doctor
|--------------------------------------------------------------------------
*/

router.get(

    "/:doctorId",

    getSingleDoctorController
);





/*
|--------------------------------------------------------------------------
| Update Doctor
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.patch(

    "/:doctorId",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    updateDoctorController
);





/*
|--------------------------------------------------------------------------
| Toggle Doctor Availability
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.patch(

    "/:doctorId/toggle-availability",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    toggleDoctorAvailabilityController
);





/*
|--------------------------------------------------------------------------
| Delete Doctor
|--------------------------------------------------------------------------
| DEVELOPER ONLY
|--------------------------------------------------------------------------
*/

router.delete(

    "/:doctorId",

    protect,

    authorize(
        "DEVELOPER"
    ),

    deleteDoctorController
);



export default router;