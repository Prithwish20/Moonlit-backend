import mongoose from "mongoose";



/*
|--------------------------------------------------------------------------
| Variant Schema
|--------------------------------------------------------------------------
*/

const variantSchema =
new mongoose.Schema({

    color: {
        type: String,
        required: true
    },

    size: {
        type: String
    },

    sku: {
        type: String,
        required: true
    },

    stock: {
        type: Number,
        default: 0
    },

    extraPrice: {
        type: Number,
        default: 0
    },

    images: [String]

}, {
    _id: true
});



/*
|--------------------------------------------------------------------------
| Lens Option Schema
|--------------------------------------------------------------------------
*/

const lensOptionSchema =
new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    description: {
        type: String
    },

    extraPrice: {
        type: Number,
        default: 0
    },

    demoImage: {
        type: String
    }

}, {
    _id: true
});



/*
|--------------------------------------------------------------------------
| Power Range Pricing Schema
|--------------------------------------------------------------------------
*/

const powerRangeSchema =
new mongoose.Schema({

    min: {
        type: Number,
        required: true
    },

    max: {
        type: Number,
        required: true
    },

    extraPrice: {
        type: Number,
        default: 0
    }

}, {
    _id: true
});



/*
|--------------------------------------------------------------------------
| Product Schema
|--------------------------------------------------------------------------
*/

const productSchema =
new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    slug: {
        type: String,
        required: true,
        unique: true
    },

    description: {
        type: String
    },

    shortDescription: {
        type: String
    },

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    },

    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "brands"
    },

    basePrice: {
        type: Number,
        required: true
    },

    thumbnail: {
        type: String,
        required: true
    },

    gallery: [String],



    /*
    |--------------------------------------------------------------------------
    | Dynamic Pricing
    |--------------------------------------------------------------------------
    */

    variants: [variantSchema],

    lensOptions: [lensOptionSchema],

    powerRanges: [powerRangeSchema],



    /*
    |--------------------------------------------------------------------------
    | Product Metadata
    |--------------------------------------------------------------------------
    */

    tags: [String],

    features: [String],

    gender: {
        type: String,
        enum: [
            "MEN",
            "WOMEN",
            "UNISEX",
            "KIDS"
        ]
    },



    /*
    |--------------------------------------------------------------------------
    | Product Status
    |--------------------------------------------------------------------------
    */

    isFeatured: {
        type: Boolean,
        default: false
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

productSchema.index({
    title: "text",
    tags: "text"
});



const productModel =
mongoose.model(
    "products",
    productSchema
);

export default productModel;