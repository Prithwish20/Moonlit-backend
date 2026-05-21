import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routers/auth.routes.js";
import categoriesRoutes from "./routers/category.routes.js";
import brandRoutes from "./routers/brand.routes.js";
import productRoutes from "./routers/product.routes.js";
import cartRoutes from "./routers/cart.routes.js";
import orderRoutes from "./routers/order.routes.js";
import invoiceRoutes from "./routers/invoice.routes.js";
import doctorRoutes from "./routers/doctor.routes.js";
import appointmentRoutes from "./routers/appointment.routes.js";
import analyticsRoutes from "./routers/analytics.routes.js";


const app = express();



/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/

// Parse JSON
app.use(express.json());


// Parse Form Data
app.use(express.urlencoded({
    extended: true
}));


// Parse Cookies
app.use(cookieParser());


// CORS
app.use(cors({

    origin: process.env.CLIENT_URL,

    credentials: true
}));




/*
|--------------------------------------------------------------------------
| Health Check Route
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {

    return res.status(200).json({

        success: true,

        message: "Server is running"
    });
});




/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use(
    "/api/v1/auth",
    authRoutes
);

app.use(
    "/api/v1/categories",
    categoriesRoutes
);

//band routes 
app.use(
    "/api/v1/brands",
    brandRoutes
);

//product routes
app.use(
    "/api/v1/products",
    productRoutes
);
//cart routes
app.use(
    "/api/v1/cart",
    cartRoutes
);

//order routes
app.use(
    "/api/v1/orders",
    orderRoutes
);

//invoice routes
app.use(
    "/api/v1/invoices",
    invoiceRoutes
);


//doctor routes
app.use(
    "/api/v1/doctors",
    doctorRoutes
);

//appointment routes
app.use(
    "/api/v1/appointments",
    appointmentRoutes
);

//analytics routes
app.use(
    "/api/v1/analytics",
    analyticsRoutes
);
/*
|--------------------------------------------------------------------------
| 404 Route
|--------------------------------------------------------------------------
*/

app.use((req, res) => {

    return res.status(404).json({

        success: false,

        message: "Route not found"
    });
});




/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {

    console.log(err);

    return res.status(500).json({

        success: false,

        message: "Internal server error"
    });
});



export default app;