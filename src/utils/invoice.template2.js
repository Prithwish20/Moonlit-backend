export const generateInvoiceHTML = ({ order, invoice }) => {
    // Helper function to format currency (USD by default, configurable)
    const formatCurrency = (amount, currency = 'usd') => {
        if (!amount && amount !== 0) return "$0.00";
        const numAmount = Number(amount);
        if (isNaN(numAmount)) return "$0.00";
        
        const symbols = { usd: '$', eur: '€', gbp: '£', inr: '₹' };
        const symbol = symbols[currency?.toLowerCase()] || '$';
        
        return `${symbol}${numAmount.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })}`;
    };

    // Helper function to format date
    const formatDate = (date) => {
        if (!date) return 'N/A';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    // Check if invoice is paid
    const isPaid = order.paymentStatus === 'paid' || 
                   order.paymentStatus === 'Paid' || 
                   order.status === 'paid' ||
                   (order.paidAmount >= order.grandTotal);

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invoice ${invoice.invoiceNumber} | ${invoice.companyName || 'Your Company'}</title>
    
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background: #f0f2f5;
            padding: 40px 20px;
            color: #1e293b;
        }

        /* Main Container */
        .invoice-container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            overflow: hidden;
            position: relative;
        }

        /* PAID OVERLAY - Only shows when paid */
        ${isPaid ? `
        .paid-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(34, 197, 94, 0.05);
            z-index: 10;
            pointer-events: none;
            border-radius: 24px;
        }
        
        .paid-stamp {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-25deg);
            background: linear-gradient(135deg, #22c55e, #16a34a);
            color: white;
            font-size: 72px;
            font-weight: 900;
            padding: 20px 60px;
            border-radius: 16px;
            border: 4px solid rgba(255,255,255,0.3);
            box-shadow: 0 20px 40px rgba(0,0,0,0.2);
            letter-spacing: 8px;
            font-family: monospace;
            text-transform: uppercase;
            white-space: nowrap;
            z-index: 20;
            opacity: 0.85;
        }
        
        .paid-ribbon {
            position: absolute;
            top: 30px;
            right: -50px;
            background: #22c55e;
            color: white;
            font-size: 14px;
            font-weight: 700;
            padding: 8px 60px;
            transform: rotate(45deg);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            text-transform: uppercase;
            letter-spacing: 2px;
            z-index: 20;
        }
        ` : ''}

        /* Header Section */
        .invoice-header {
            background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
            color: white;
            padding: 40px 48px;
            position: relative;
        }

        .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            flex-wrap: wrap;
            gap: 20px;
        }

        .brand h1 {
            font-size: 28px;
            font-weight: 700;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }

        .brand p {
            opacity: 0.7;
            font-size: 14px;
        }

        .invoice-meta {
            text-align: right;
        }

        .invoice-label {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 2px;
            opacity: 0.6;
        }

        .invoice-number {
            font-size: 28px;
            font-weight: 700;
            margin-top: 4px;
            font-family: monospace;
        }

        .status-badge-large {
            display: inline-block;
            margin-top: 12px;
            padding: 6px 16px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
            background: ${isPaid ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)'};
            color: ${isPaid ? '#86efac' : '#fde047'};
            border: 1px solid ${isPaid ? 'rgba(34, 197, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'};
        }

        /* Company Address */
        .company-address {
            margin-top: 24px;
            padding-top: 24px;
            border-top: 1px solid rgba(255,255,255,0.1);
            font-size: 12px;
            opacity: 0.7;
            line-height: 1.6;
        }

        /* Content */
        .invoice-content {
            padding: 48px;
        }

        /* Info Grid */
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
            margin-bottom: 40px;
        }

        .info-section h3 {
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #64748b;
            margin-bottom: 16px;
        }

        .info-card {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
        }

        .info-row {
            display: flex;
            margin-bottom: 12px;
        }

        .info-label {
            width: 100px;
            font-size: 12px;
            color: #64748b;
            font-weight: 500;
        }

        .info-value {
            flex: 1;
            font-size: 14px;
            font-weight: 500;
            color: #1e293b;
        }

        /* Items Table */
        .items-section {
            margin: 32px 0;
        }

        .items-section h3 {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 16px;
            color: #1e293b;
        }

        .items-table {
            width: 100%;
            border-collapse: collapse;
        }

        .items-table th {
            text-align: left;
            padding: 12px 0;
            border-bottom: 2px solid #e2e8f0;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #64748b;
        }

        .items-table td {
            padding: 16px 0;
            border-bottom: 1px solid #f1f5f9;
            font-size: 14px;
        }

        .items-table th:last-child,
        .items-table td:last-child {
            text-align: right;
        }

        .items-table th:first-child,
        .items-table td:first-child {
            text-align: left;
        }

        .item-title {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 4px;
        }

        .item-sku {
            font-size: 11px;
            color: #94a3b8;
            font-family: monospace;
        }

        /* Summary */
        .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-top: 32px;
            padding-top: 24px;
            border-top: 2px solid #e2e8f0;
        }

        .summary-card {
            width: 320px;
        }

        .summary-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            font-size: 14px;
        }

        .summary-row.subtotal {
            color: #64748b;
        }

        .summary-row.discount {
            color: #ef4444;
        }

        .summary-row.total {
            border-top: 2px solid #e2e8f0;
            margin-top: 8px;
            padding-top: 16px;
            font-weight: 700;
            font-size: 18px;
            color: #1e293b;
        }

        /* Payment Details */
        .payment-details {
            background: #f8fafc;
            border-radius: 16px;
            padding: 20px;
            margin-top: 32px;
        }

        .payment-details h4 {
            font-size: 13px;
            font-weight: 600;
            color: #64748b;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .payment-grid {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
        }

        .payment-item {
            flex: 1;
        }

        .payment-label {
            font-size: 11px;
            color: #94a3b8;
            margin-bottom: 4px;
        }

        .payment-value {
            font-size: 14px;
            font-weight: 600;
            color: #1e293b;
        }

        /* Footer */
        .invoice-footer {
            background: #f8fafc;
            padding: 32px 48px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }

        .footer-note {
            font-size: 12px;
            color: #64748b;
            margin-bottom: 12px;
        }

        .footer-thanks {
            font-weight: 600;
            color: #1e293b;
            margin-bottom: 8px;
        }

        /* Print Styles */
        @media print {
            body {
                background: white;
                padding: 0;
                margin: 0;
            }
            
            .invoice-container {
                box-shadow: none;
                border-radius: 0;
            }
            
            .status-badge-large,
            ${isPaid ? '.paid-stamp, .paid-ribbon' : ''} {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
        }
    </style>
</head>
<body>
    <div class="invoice-container">
        ${isPaid ? `
        <div class="paid-overlay"></div>
        <div class="paid-stamp">PAID</div>
        <div class="paid-ribbon">✓ PAID IN FULL ✓</div>
        ` : ''}
        
        <!-- Header -->
        <div class="invoice-header">
            <div class="header-top">
                <div class="brand">
                    <h1>${invoice.companyName || 'ACME INC.'}</h1>
                    <p>${invoice.tagline || 'Premium Solutions'}</p>
                </div>
                <div class="invoice-meta">
                    <div class="invoice-label">INVOICE</div>
                    <div class="invoice-number">${invoice.invoiceNumber}</div>
                    <div class="status-badge-large">
                        ${isPaid ? '✓ PAID' : '● PENDING'}
                    </div>
                </div>
            </div>
            <div class="company-address">
                ${invoice.companyAddress || '123 Business Ave, Suite 100<br>San Francisco, CA 94107<br>United States'}
            </div>
        </div>
        
        <!-- Content -->
        <div class="invoice-content">
            <!-- Info Grid -->
            <div class="info-grid">
                <div class="info-section">
                    <h3>BILL TO</h3>
                    <div class="info-card">
                        <div class="info-row">
                            <div class="info-label">Customer</div>
                            <div class="info-value">${order.customer?.name || order.user?.name || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Email</div>
                            <div class="info-value">${order.customer?.email || order.user?.email || 'N/A'}</div>
                        </div>
                        ${order.customer?.phone ? `
                        <div class="info-row">
                            <div class="info-label">Phone</div>
                            <div class="info-value">${order.customer.phone}</div>
                        </div>` : ''}
                        ${order.shippingAddress ? `
                        <div class="info-row">
                            <div class="info-label">Address</div>
                            <div class="info-value">${order.shippingAddress}</div>
                        </div>` : ''}
                    </div>
                </div>
                
                <div class="info-section">
                    <h3>INVOICE DETAILS</h3>
                    <div class="info-card">
                        <div class="info-row">
                            <div class="info-label">Invoice Date</div>
                            <div class="info-value">${formatDate(invoice.createdAt || new Date())}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Due Date</div>
                            <div class="info-value">${formatDate(invoice.dueDate) || 'N/A'}</div>
                        </div>
                        <div class="info-row">
                            <div class="info-label">Order ID</div>
                            <div class="info-value">${order.orderNumber || order.id || 'N/A'}</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Items -->
            <div class="items-section">
                <h3>ORDER SUMMARY</h3>
                <table class="items-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th style="text-align: center">Qty</th>
                            <th style="text-align: right">Unit Price</th>
                            <th style="text-align: right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items?.map(item => `
                        <tr>
                            <td>
                                <div class="item-title">${item.name || item.title || 'Product'}</div>
                                ${item.sku ? `<div class="item-sku">SKU: ${item.sku}</div>` : ''}
                                ${item.description ? `<div style="font-size:12px;color:#64748b;margin-top:4px;">${item.description}</div>` : ''}
                            </td>
                            <td style="text-align: center">${item.quantity || 1}</td>
                            <td style="text-align: right">${formatCurrency(item.unitPrice || item.price, invoice.currency)}</td>
                            <td style="text-align: right">${formatCurrency((item.unitPrice || item.price) * (item.quantity || 1), invoice.currency)}</td>
                        </tr>
                        `).join('') || `
                        <tr>
                            <td colspan="4" style="text-align: center; padding: 40px; color: #94a3b8;">
                                No items available
                            </td>
                        </tr>
                        `}
                    </tbody>
                </table>
            </div>
            
            <!-- Summary -->
            <div class="summary-section">
                <div class="summary-card">
                    <div class="summary-row subtotal">
                        <span>Subtotal</span>
                        <span>${formatCurrency(order.subtotal || order.grandTotal, invoice.currency)}</span>
                    </div>
                    ${order.discountAmount > 0 ? `
                    <div class="summary-row discount">
                        <span>Discount ${order.discountCode ? `(${order.discountCode})` : ''}</span>
                        <span>-${formatCurrency(order.discountAmount, invoice.currency)}</span>
                    </div>
                    ` : ''}
                    ${order.taxAmount > 0 ? `
                    <div class="summary-row subtotal">
                        <span>Tax (${order.taxRate || 'GST'} ${order.taxPercentage ? order.taxPercentage + '%' : ''})</span>
                        <span>${formatCurrency(order.taxAmount, invoice.currency)}</span>
                    </div>
                    ` : ''}
                    ${order.shippingCost > 0 ? `
                    <div class="summary-row subtotal">
                        <span>Shipping</span>
                        <span>${formatCurrency(order.shippingCost, invoice.currency)}</span>
                    </div>
                    ` : ''}
                    <div class="summary-row total">
                        <span>Grand Total</span>
                        <span>${formatCurrency(order.grandTotal, invoice.currency)}</span>
                    </div>
                    ${!isPaid && order.paidAmount > 0 ? `
                    <div class="summary-row subtotal">
                        <span>Amount Paid</span>
                        <span style="color:#22c55e">${formatCurrency(order.paidAmount, invoice.currency)}</span>
                    </div>
                    <div class="summary-row total" style="border-top-color:#ef4444;color:#ef4444;">
                        <span>Balance Due</span>
                        <span>${formatCurrency(order.dueAmount || (order.grandTotal - order.paidAmount), invoice.currency)}</span>
                    </div>
                    ` : ''}
                </div>
            </div>
            
            <!-- Payment Details -->
            <div class="payment-details">
                <h4>PAYMENT INFORMATION</h4>
                <div class="payment-grid">
                    <div class="payment-item">
                        <div class="payment-label">Payment Status</div>
                        <div class="payment-value" style="color: ${isPaid ? '#22c55e' : '#f59e0b'}">
                            ${isPaid ? 'Paid in Full' : (order.paymentStatus || 'Pending')}
                        </div>
                    </div>
                    ${order.transactionId ? `
                    <div class="payment-item">
                        <div class="payment-label">Transaction ID</div>
                        <div class="payment-value" style="font-family: monospace;">${order.transactionId}</div>
                    </div>
                    ` : ''}
                    ${order.paymentMethod ? `
                    <div class="payment-item">
                        <div class="payment-label">Payment Method</div>
                        <div class="payment-value">${order.paymentMethod}</div>
                    </div>
                    ` : ''}
                    ${order.paidAt ? `
                    <div class="payment-item">
                        <div class="payment-label">Paid On</div>
                        <div class="payment-value">${formatDate(order.paidAt)}</div>
                    </div>
                    ` : ''}
                </div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="invoice-footer">
            <div class="footer-thanks">
                Thank you for your business! ✨
            </div>
            <div class="footer-note">
                This is a computer-generated invoice and requires no signature.<br>
                For support, contact ${invoice.supportEmail || 'support@example.com'} or call ${invoice.supportPhone || '+1 (555) 123-4567'}
            </div>
        </div>
    </div>
</body>
</html>
    `;
};