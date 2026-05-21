import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { generateInvoiceHTML } from "./invoice.template.js";

/*
|--------------------------------------------------------------------------
| Generate Invoice PDF (Puppeteer)
|--------------------------------------------------------------------------
*/

const generateInvoicePdf = async ({ order, invoice }) => {

    const invoicesDir = path.join(
        process.cwd(),
        "uploads",
        "invoices"
    );

    if (!fs.existsSync(invoicesDir)) {
        fs.mkdirSync(invoicesDir, { recursive: true });
    }

    const filePath = path.join(
        invoicesDir,
        `${invoice.invoiceNumber}.pdf`
    );

    const html = generateInvoiceHTML({ order, invoice });

    const browser = await puppeteer.launch({
        headless: "new",
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });

    const page = await browser.newPage();

    await page.setContent(html, {
        waitUntil: "networkidle0"
    });

    await page.pdf({
        path: filePath,
        format: "A4",
        printBackground: true
    });

    await browser.close();

    return filePath;
};

export default generateInvoicePdf;