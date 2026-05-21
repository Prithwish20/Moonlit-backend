import {
    calculateFinalPrice
} from "../services/pricing.service.js";



/*
|--------------------------------------------------------------------------
| Calculate Product Price
|--------------------------------------------------------------------------
*/

export const calculatePriceController =
async (req, res) => {

    try {

        const {

            productId,

            variantId,

            lensOptionId,

            power

        } = req.body;



        const pricing =
            await calculateFinalPrice({

                productId,

                variantId,

                lensOptionId,

                power
            });



        return res.status(200).json({

            success: true,

            pricing
        });

    } catch (error) {

        console.log(error);

        return res.status(400).json({

            success: false,

            message: error.message
        });
    }
};