import productModel from "../models/product.model.js";



/*
|--------------------------------------------------------------------------
| Calculate Final Product Price
|--------------------------------------------------------------------------
| Params:
| {
|   productId,
|   variantId,
|   lensOptionId,
|   power
| }
|--------------------------------------------------------------------------
*/

export const calculateFinalPrice = async ({

    productId,

    variantId,

    lensOptionId,

    power

}) => {

    /*
    |--------------------------------------------------------------------------
    | Find Product
    |--------------------------------------------------------------------------
    */

    const product =
        await productModel.findOne({

            _id: productId,

            isActive: true
        });


    if (!product) {

        throw new Error(
            "Product not found"
        );
    }



    /*
    |--------------------------------------------------------------------------
    | Base Price
    |--------------------------------------------------------------------------
    */

    const basePrice =
        product.basePrice;



    /*
    |--------------------------------------------------------------------------
    | Variant Price
    |--------------------------------------------------------------------------
    */

    let variantPrice = 0;

    let selectedVariant = null;


    if (variantId) {

        selectedVariant =
            product.variants.id(variantId);


        if (!selectedVariant) {

            throw new Error(
                "Variant not found"
            );
        }


        variantPrice =
            selectedVariant.extraPrice || 0;
    }



    /*
    |--------------------------------------------------------------------------
    | Lens Option Price
    |--------------------------------------------------------------------------
    */

    let lensPrice = 0;

    let selectedLens = null;


    if (lensOptionId) {

        selectedLens =
            product.lensOptions.id(
                lensOptionId
            );


        if (!selectedLens) {

            throw new Error(
                "Lens option not found"
            );
        }


        lensPrice =
            selectedLens.extraPrice || 0;
    }



    /*
    |--------------------------------------------------------------------------
    | Power Range Price
    |--------------------------------------------------------------------------
    */

    let powerPrice = 0;

    let matchedPowerRange = null;


    if (
        power !== undefined &&
        power !== null
    ) {

        matchedPowerRange =
        product.powerRanges.find((range) => {
    
            const min =
                Math.min(
                    range.min,
                    range.max
                );
    
            const max =
                Math.max(
                    range.min,
                    range.max
                );
    
            return (
                power >= min &&
                power <= max
            );
        });


        if (matchedPowerRange) {

            powerPrice =
                matchedPowerRange.extraPrice || 0;
        }
    }



    /*
    |--------------------------------------------------------------------------
    | Final Price
    |--------------------------------------------------------------------------
    */

    const finalPrice =

        basePrice +

        variantPrice +

        lensPrice +

        powerPrice;



    /*
    |--------------------------------------------------------------------------
    | Return Price Breakdown
    |--------------------------------------------------------------------------
    */

    return {

        productId:
            product._id,

        title:
            product.title,



        basePrice,



        variant: selectedVariant
            ? {
                id:
                    selectedVariant._id,

                color:
                    selectedVariant.color,

                size:
                    selectedVariant.size,

                sku:
                    selectedVariant.sku
            }
            : null,



        variantPrice,



        lensOption: selectedLens
            ? {
                id:
                    selectedLens._id,

                name:
                    selectedLens.name
            }
            : null,



        lensPrice,



        power:
            power || null,



        powerRange:
            matchedPowerRange
                ? {
                    min:
                        matchedPowerRange.min,

                    max:
                        matchedPowerRange.max
                }
                : null,



        powerPrice,



        finalPrice
    };
};