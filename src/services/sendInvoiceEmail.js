import nodemailer from "nodemailer";



/*
|--------------------------------------------------------------------------
| Send Invoice Email
|--------------------------------------------------------------------------
*/

const sendInvoiceEmail =
async ({

    customerEmail,

    customerName,

    invoiceNumber,

    pdfUrl

}) => {

    /*
    |--------------------------------------------------------------------------
    | Transporter
    |--------------------------------------------------------------------------
    */

    const transporter =
        nodemailer.createTransport({

            service: "gmail",

            auth: {

                user:
                    process.env.EMAIL_USER,

                pass:
                    process.env.EMAIL_PASS
            }
        });



    /*
    |--------------------------------------------------------------------------
    | Mail Options
    |--------------------------------------------------------------------------
    */

    const mailOptions = {

        from:
            process.env.EMAIL_USER,



        to:
            customerEmail,



        subject:
            `Invoice ${invoiceNumber} - Moonlit Optics`,



        html: `

            <h2>Hello ${customerName}</h2>

            <p>
                Your invoice has been generated successfully.
            </p>

            <p>
                Invoice Number:
                <strong>${invoiceNumber}</strong>
            </p>

            <p>
                Download Invoice:
            </p>

            <a href="${pdfUrl}">
                Download PDF
            </a>

            <br />
            <br />

            <p>
                Thank you for choosing
                Moonlit Optics.
            </p>
        `
    };



    /*
    |--------------------------------------------------------------------------
    | Send Email
    |--------------------------------------------------------------------------
    */

    await transporter.sendMail(
        mailOptions
    );
};



export default sendInvoiceEmail;