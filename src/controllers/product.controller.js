import productModel from "../models/product.model.js";



/*
|--------------------------------------------------------------------------
| Create Product
|--------------------------------------------------------------------------
*/

export const createProductController =
async (req, res) => {

    try {

        const product =
            await productModel.create(req.body);


        return res.status(201).json({

            success: true,

            message: "Product created successfully",

            product
        });

    } catch (error) {

        console.log(error);


        if (error.code === 11000) {

            return res.status(400).json({

                success: false,

                message:
                    "Product slug already exists"
            });
        }


        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};




/*
|--------------------------------------------------------------------------
| Get All Products
|--------------------------------------------------------------------------
*/

export const getProductsController =
async (req, res) => {

    try {

        const {
            search,
            category,
            brand,
            gender,
            minPrice,
            maxPrice,
            page = 1,
            limit = 10
        } = req.query;



        /*
        |--------------------------------------------------------------------------
        | Build Query
        |--------------------------------------------------------------------------
        */

        const query = {

            isActive: true
        };



        /*
        |--------------------------------------------------------------------------
        | Search
        |--------------------------------------------------------------------------
        */

        if (search) {

            query.$text = {
                $search: search
            };
        }



        /*
        |--------------------------------------------------------------------------
        | Filters
        |--------------------------------------------------------------------------
        */

        if (category) {
            query.category = category;
        }

        if (brand) {
            query.brand = brand;
        }

        if (gender) {
            query.gender = gender;
        }



        /*
        |--------------------------------------------------------------------------
        | Price Range
        |--------------------------------------------------------------------------
        */

        if (minPrice || maxPrice) {

            query.basePrice = {};

            if (minPrice) {
                query.basePrice.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {
                query.basePrice.$lte =
                    Number(maxPrice);
            }
        }



        /*
        |--------------------------------------------------------------------------
        | Pagination
        |--------------------------------------------------------------------------
        */

        const skip =
            (Number(page) - 1) *
            Number(limit);



        /*
        |--------------------------------------------------------------------------
        | Fetch Products
        |--------------------------------------------------------------------------
        */

        const products =
            await productModel
                .find(query)

                .populate(
                    "category",
                    "name slug"
                )

                .populate(
                    "brand",
                    "name"
                )

                .sort({
                    createdAt: -1
                })

                .skip(skip)

                .limit(Number(limit));



        const total =
            await productModel.countDocuments(query);



        return res.status(200).json({

            success: true,

            total,

            currentPage: Number(page),

            totalPages:
                Math.ceil(
                    total / Number(limit)
                ),

            products
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};




/*
|--------------------------------------------------------------------------
| Get Single Product
|--------------------------------------------------------------------------
*/

export const getSingleProductController =
async (req, res) => {

    try {

        const { slug } = req.params;


        const product =
            await productModel

                .findOne({
                    slug,
                    isActive: true
                })

                .populate(
                    "category",
                    "name slug"
                )

                .populate(
                    "brand",
                    "name"
                );


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }


        return res.status(200).json({

            success: true,

            product
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};




/*
|--------------------------------------------------------------------------
| Update Product
|--------------------------------------------------------------------------
*/

export const updateProductController =
async (req, res) => {

    try {

        const { id } = req.params;


        const updatedProduct =
            await productModel.findByIdAndUpdate(

                id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );


        if (!updatedProduct) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }


        return res.status(200).json({

            success: true,

            message:
                "Product updated successfully",

            product: updatedProduct
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};




/*
|--------------------------------------------------------------------------
| Delete Product
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const deleteProductController =
async (req, res) => {

    try {

        const { id } = req.params;


        const product =
            await productModel.findById(id);


        if (!product) {

            return res.status(404).json({

                success: false,

                message: "Product not found"
            });
        }


        product.isActive = false;

        await product.save();


        return res.status(200).json({

            success: true,

            message:
                "Product deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};