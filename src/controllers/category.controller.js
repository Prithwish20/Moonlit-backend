import categoryModel from "../models/category.model.js";



/*
|--------------------------------------------------------------------------
| Create Category
|--------------------------------------------------------------------------
*/

export const createCategoryController =
async (req, res) => {

    try {

        const {
            name,
            slug,
            description,
            image
        } = req.body;



        const existingCategory =
            await categoryModel.findOne({
                $or: [
                    { name },
                    { slug }
                ]
            });



        if (existingCategory) {
            console.log(existingCategory);
            return res.status(400).json({

                success: false,

                message:
                    "Category already exists"
            });
        }



        const category =
            await categoryModel.create({

                name,
                slug,
                description,
                image
            });



        return res.status(201).json({

            success: true,

            message:
                "Category created successfully",

            category
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
| Get Categories
|--------------------------------------------------------------------------
*/

export const getCategoriesController =
async (req, res) => {

    try {

        const categories =
            await categoryModel

                .find({
                    isActive: true
                })

                .sort({
                    createdAt: -1
                });



        return res.status(200).json({

            success: true,

            total: categories.length,

            categories
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
| Get Single Category
|--------------------------------------------------------------------------
*/

export const getSingleCategoryController =
async (req, res) => {

    try {

        const { slug } = req.params;



        const category =
            await categoryModel.findOne({

                slug,

                isActive: true
            });



        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found"
            });
        }



        return res.status(200).json({

            success: true,

            category
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
| Update Category
|--------------------------------------------------------------------------
*/

export const updateCategoryController =
async (req, res) => {

    try {

        const { id } = req.params;



        const updatedCategory =
            await categoryModel.findByIdAndUpdate(

                id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }
            );



        if (!updatedCategory) {

            return res.status(404).json({

                success: false,

                message: "Category not found"
            });
        }



        return res.status(200).json({

            success: true,

            message:
                "Category updated successfully",

            category: updatedCategory
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
| Delete Category
|--------------------------------------------------------------------------
| Soft Delete
|--------------------------------------------------------------------------
*/

export const deleteCategoryController =
async (req, res) => {

    try {

        const { id } = req.params;



        const category =
            await categoryModel.findById(id);



        if (!category) {

            return res.status(404).json({

                success: false,

                message: "Category not found"
            });
        }



        category.isActive = false;

        await category.save();



        return res.status(200).json({

            success: true,

            message:
                "Category deleted successfully"
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({

            success: false,

            message: "Internal server error"
        });
    }
};