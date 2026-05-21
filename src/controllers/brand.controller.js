import brandModel from "../models/brand.model.js";



/*
|--------------------------------------------------------------------------
| Create Brand
|--------------------------------------------------------------------------
*/

export const createBrandController =
async (req, res) => {

    try {

        const {
            name,
            logo,
            description
        } = req.body;



        const existingBrand =
            await brandModel.findOne({
                name
            });



        if (existingBrand) {

            return res.status(400).json({

                success: false,

                message:
                    "Brand already exists"
            });
        }



        const brand =
            await brandModel.create({

                name,
                logo,
                description
            });



        return res.status(201).json({

            success: true,

            message:
                "Brand created successfully",

            brand
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
| Get Brands
|--------------------------------------------------------------------------
*/

export const getBrandsController =
async (req, res) => {

    try {

        const brands =
            await brandModel

                .find({
                    isActive: true
                })

                .sort({
                    createdAt: -1
                });



        return res.status(200).json({

            success: true,

            total: brands.length,

            brands
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
| Get Single Brand
|--------------------------------------------------------------------------
*/

export const getSingleBrandController =
async (req, res) => {

    try {

        const { id } = req.params;



        const brand =
            await brandModel.findOne({

                _id: id,

                isActive: true
            });



        if (!brand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found"
            });
        }



        return res.status(200).json({

            success: true,

            brand
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
| Update Brand
|--------------------------------------------------------------------------
*/

export const updateBrandController =
async (req, res) => {

    try {

        const { id } = req.params;



        const updatedBrand =
            await brandModel.findByIdAndUpdate(

                id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );



        if (!updatedBrand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found"
            });
        }



        return res.status(200).json({

            success: true,

            message:
                "Brand updated successfully",

            brand: updatedBrand
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
| Delete Brand
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const deleteBrandController =
async (req, res) => {

    try {

        const { id } = req.params;



        const brand =
            await brandModel.findById(id);



        if (!brand) {

            return res.status(404).json({

                success: false,

                message: "Brand not found"
            });
        }



        brand.isActive = false;

        await brand.save();



        return res.status(200).json({

            success: true,

            message:
                "Brand deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};