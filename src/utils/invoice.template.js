export const generateInvoiceHTML = ({ order, invoice }) => {
    // Helper function to format currency
    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return "₹0";
        const numAmount = Number(amount);
        if (isNaN(numAmount)) return "₹0";
        return `₹${numAmount.toLocaleString('en-IN')}`;
    };

    // Helper function to format date
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Invoice ${invoice.invoiceNumber} | Moonlit Optics</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 20px;
            color: #1a1f36;
        }

        .invoice-wrapper {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }

        .invoice-header {
            background: linear-gradient(135deg, #1a237e 0%, #283593 100%);
            color: white;
            padding: 40px 50px;
            position: relative;
        }

        .invoice-header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.05)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,154.7C960,171,1056,181,1152,165.3C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') repeat-x bottom;
            background-size: cover;
            opacity: 0.1;
        }

        .company-info {
            position: relative;
            z-index: 1;
        }

        .company-name {
            font-size: 32px;
            font-weight: 700;
            letter-spacing: 2px;
            margin-bottom: 10px;
        }

        .company-tagline {
            font-size: 14px;
            opacity: 0.9;
            margin-bottom: 20px;
        }

        .company-details {
            font-size: 12px;
            opacity: 0.8;
            line-height: 1.6;
        }

        .invoice-title {
            position: relative;
            z-index: 1;
            text-align: right;
            margin-top: -60px;
        }

        .invoice-badge {
            display: inline-block;
            background: rgba(255,255,255,0.2);
            padding: 8px 20px;
            border-radius: 50px;
            font-size: 14px;
            font-weight: 600;
            backdrop-filter: blur(10px);
        }

        .invoice-number {
            font-size: 28px;
            font-weight: 700;
            margin-top: 10px;
            letter-spacing: 1px;
        }

        .content {
            padding: 40px 50px;
        }

        /* Meta Info Cards */
        .meta-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
        }

        .meta-card {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 12px;
            border-left: 4px solid #1a237e;
        }

        .meta-label {
            font-size: 11px;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 600;
            color: #6c757d;
            margin-bottom: 8px;
        }

        .meta-value {
            font-size: 16px;
            font-weight: 600;
            color: #1a1f36;
        }

        /* Customer Section */
        .section {
            margin-bottom: 35px;
        }

        .section-title {
            font-size: 18px;
            font-weight: 700;
            color: #1a237e;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9ecef;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .section-title::before {
            content: '';
            width: 4px;
            height: 20px;
            background: #1a237e;
            border-radius: 2px;
        }

        .customer-card {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 12px;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
        }

        .customer-field {
            font-size: 14px;
        }

        .customer-label {
            font-weight: 600;
            color: #6c757d;
            margin-bottom: 4px;
            font-size: 12px;
        }

        .customer-value {
            color: #1a1f36;
            font-weight: 500;
        }

        /* Items Table */
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }

        .items-table th {
            background: #f8f9fa;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #6c757d;
            border-bottom: 2px solid #e9ecef;
        }

        .items-table td {
            padding: 16px 12px;
            border-bottom: 1px solid #e9ecef;
            vertical-align: top;
        }

        .item-title {
            font-weight: 600;
            color: #1a1f36;
            margin-bottom: 6px;
        }

        .item-details {
            font-size: 12px;
            color: #6c757d;
            line-height: 1.5;
        }

        .item-details div {
            margin-top: 3px;
        }

        .amount {
            text-align: right;
            font-weight: 500;
        }

        /* Summary Section */
        .summary-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 20px;
        }

        .summary-card {
            width: 350px;
            background: #f8f9fa;
            border-radius: 12px;
            padding: 25px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
            border-bottom: 1px solid #e9ecef;
        }

        .summary-row.total {
            border-top: 2px solid #1a237e;
            border-bottom: none;
            margin-top: 10px;
            padding-top: 15px;
            font-weight: 700;
            font-size: 18px;
            color: #1a237e;
        }

        .summary-row.due {
            border-bottom: none;
            font-weight: 600;
        }

        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
        }

        .status-paid {
            background: #d4edda;
            color: #155724;
        }

        .status-partial {
            background: #fff3cd;
            color: #856404;
        }

        .status-pending {
            background: #f8d7da;
            color: #721c24;
        }

        /* Payment Info */
        .payment-info {
            background: #e8f0fe;
            padding: 15px;
            border-radius: 12px;
            margin-top: 20px;
        }

        .payment-title {
            font-size: 13px;
            font-weight: 600;
            color: #1a237e;
            margin-bottom: 10px;
        }

        /* Footer */
        .invoice-footer {
            background: #f8f9fa;
            padding: 30px 50px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }

        .footer-message {
            color: #1a237e;
            font-weight: 600;
            margin-bottom: 10px;
        }

        .footer-note {
            font-size: 11px;
            color: #6c757d;
            line-height: 1.6;
        }

        .support-info {
            margin-top: 15px;
            font-size: 11px;
            color: #6c757d;
        }

        @media print {
            body {
                background: white;
                padding: 0;
            }
            .invoice-wrapper {
                box-shadow: none;
                border-radius: 0;
            }
            .status-badge {
                print-color-adjust: exact;
            }
        }
    </style>
</head>

<body>
    <div class="invoice-wrapper">
        <!-- Header Section -->
        <div class="invoice-header">
            <div class="company-info">
                <div class="company-name">MOONLIT OPTICS</div>
                <div class="company-tagline">Premium Eyewear Solutions</div>
                <div class="company-details">
                    123 Fashion Avenue, Mumbai - 400001<br />
                    +91 98765 43210 | care@moonlitoptics.com<br />
                    GST: 27AAAAA1234B1Z
                </div>
            </div>
            <div class="invoice-title">
                <div class="invoice-badge">TAX INVOICE</div>
                <div class="invoice-number">${invoice.invoiceNumber}</div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="content">
            <!-- Meta Information -->
            <div class="meta-grid">
                <div class="meta-card">
                    <div class="meta-label">Invoice Date</div>
                    <div class="meta-value">${formatDate(new Date())}</div>
                </div>
                <div class="meta-card">
                    <div class="meta-label">Order Number</div>
                    <div class="meta-value">${order.orderNumber || 'N/A'}</div>
                </div>
                <div class="meta-card">
                    <div class="meta-label">Order Date</div>
                    <div class="meta-value">${formatDate(order.createdAt || new Date())}</div>
                </div>
            </div>

            <!-- Customer Details -->
            <div class="section">
                <div class="section-title">Bill To</div>
                <div class="customer-card">
                    <div class="customer-field">
                        <div class="customer-label">Customer Name</div>
                        <div class="customer-value">${order.user?.name || 'N/A'}</div>
                    </div>
                    <div class="customer-field">
                        <div class="customer-label">Email Address</div>
                        <div class="customer-value">${order.user?.email || 'N/A'}</div>
                    </div>
                    ${order.user?.phone ? `
                    <div class="customer-field">
                        <div class="customer-label">Phone Number</div>
                        <div class="customer-value">${order.user.phone}</div>
                    </div>` : ''}
                    ${order.shippingAddress ? `
                    <div class="customer-field">
                        <div class="customer-label">Shipping Address</div>
                        <div class="customer-value">${order.shippingAddress}</div>
                    </div>` : ''}
                </div>
            </div>

            <!-- Ordered Items -->
            <div class="section">
                <div class="section-title">Order Summary</div>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th style="text-align: center">Quantity</th>
                            <th style="text-align: right">Unit Price</th>
                            <th style="text-align: right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                        <tr>
                            <td>
                                <div class="item-title">${item.title || 'Product'}</div>
                                <div class="item-details">
                                    ${item.variant?.color ? `<div>Color: ${item.variant.color}</div>` : ''}
                                    ${item.lensOption?.name ? `<div>Lens: ${item.lensOption.name}</div>` : ''}
                                    ${item.power ? `<div>Power: ${item.power}</div>` : ''}
                                </div>
                            </td>
                            <td style="text-align: center">${item.quantity || 0}</td>
                            <td style="text-align: right">${formatCurrency(item.finalPrice)}</td>
                            <td style="text-align: right" class="amount">${formatCurrency(item.totalPrice)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <!-- Payment Summary -->
            <div class="summary-wrapper">
                <div class="summary-card">
                    <div class="summary-row">
                        <span>Subtotal</span>
                        <span>${formatCurrency(order.subtotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Discount</span>
                        <span style="color: #dc3545">-${formatCurrency(order.discountAmount)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Tax (GST)</span>
                        <span>${formatCurrency(order.taxAmount)}</span>
                    </div>
                    <div class="summary-row total">
                        <span>Grand Total</span>
                        <span>${formatCurrency(order.grandTotal)}</span>
                    </div>
                    <div class="summary-row">
                        <span>Paid Amount</span>
                        <span style="color: #28a745">${formatCurrency(order.paidAmount)}</span>
                    </div>
                    <div class="summary-row due">
                        <span>Due Amount</span>
                        <span style="color: ${order.dueAmount > 0 ? '#dc3545' : '#28a745'}">${formatCurrency(order.dueAmount)}</span>
                    </div>
                </div>
            </div>

            <!-- Payment Status -->
            <div class="payment-info">
                <div class="payment-title">Payment Information</div>
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                    <div>
                        <strong>Payment Status:</strong> 
                        <span class="status-badge ${order.paymentStatus === 'Paid' ? 'status-paid' : (order.paymentStatus === 'Partial' ? 'status-partial' : 'status-pending')}">
                            ${order.paymentStatus || 'Pending'}
                        </span>
                    </div>
                    <div>
                        <strong>Order Status:</strong> 
                        <span class="status-badge status-paid">
                            ${order.orderStatus || 'Processing'}
                        </span>
                    </div>
                    ${order.transactionId ? `
                    <div>
                        <strong>Transaction ID:</strong> ${order.transactionId}
                    </div>` : ''}
                </div>
            </div>
        </div>

        <!-- Footer Section -->
        <div class="invoice-footer">
            <div class="footer-message">
                Thank you for choosing Moonlit Optics! ✨
            </div>
            <div class="footer-note">
                This is a computer-generated invoice and requires no signature.<br />
                For any queries, please contact our customer support.
            </div>
            <div class="support-info">
                support@moonlitoptics.com | +91 98765 43210 | www.moonlitoptics.com
            </div>
        </div>
    </div>
</body>
</html>
    `;
};