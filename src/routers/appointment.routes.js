import express from "express";

import {

    createAppointmentController,

    getMyAppointmentsController,

    getAllAppointmentsController,

    updateAppointmentStatusController,

    cancelAppointmentController

} from "../controllers/appointment.controller.js";


import {

    protect,

    authorize

} from "../middleware/auth.middleware.js";



const router =
    express.Router();



/*
|--------------------------------------------------------------------------
| Create Appointment
|--------------------------------------------------------------------------
| USER / OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.post(

    "/",

    protect,

    authorize(
        "USER",
        "OWNER",
        "DEVELOPER"
    ),

    createAppointmentController
);





/*
|--------------------------------------------------------------------------
| Get My Appointments
|--------------------------------------------------------------------------
*/

router.get(

    "/my-appointments",

    protect,

    getMyAppointmentsController
);





/*
|--------------------------------------------------------------------------
| Get All Appointments
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.get(

    "/",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    getAllAppointmentsController
);





/*
|--------------------------------------------------------------------------
| Update Appointment Status
|--------------------------------------------------------------------------
| OWNER / DEVELOPER
|--------------------------------------------------------------------------
*/

router.patch(

    "/:appointmentId/status",

    protect,

    authorize(
        "OWNER",
        "DEVELOPER"
    ),

    updateAppointmentStatusController
);





/*
|--------------------------------------------------------------------------
| Cancel Appointment
|--------------------------------------------------------------------------
*/

router.patch(

    "/:appointmentId/cancel",

    protect,

    cancelAppointmentController
);



export default router;