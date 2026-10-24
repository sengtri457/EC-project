import { Order } from "@/types";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function buildInvoiceHtml(order: Order): string {
  const safeName = escapeHtml(order.customer.name);
  const safeEmail = escapeHtml(order.customer.email);
  const safePhone = escapeHtml(order.customer.phone);
  const safeAddress = escapeHtml(order.customer.address);
  const safeOrderId = escapeHtml(order.id);

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-size: 13px; font-weight: 600; color: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          ${escapeHtml(item.title)}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-size: 13px; text-align: center; color: #525252; font-family: monospace;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-size: 13px; text-align: right; color: #525252; font-family: monospace;">
          $${item.price.toFixed(2)}
        </td>
        <td style="padding: 14px 16px; border-bottom: 1px solid #e5e5e5; font-size: 13px; text-align: right; font-weight: 700; color: #0a0a0a; font-family: monospace;">
          $${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>
    `
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${safeOrderId} — Clothes™ Apparel Co.</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #fafaf8;
      color: #1a1a1a;
      padding: 48px 20px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-card {
      max-width: 800px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e6e6e2;
      overflow: hidden;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
    }
    .header-bar {
      padding: 36px 36px 28px 36px;
      border-bottom: 1px solid #1a1a1a;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      background: #1a1a1a;
      color: #fafaf8;
    }
    .brand-logo {
      font-size: 26px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #ffffff;
      line-height: 1;
      font-family: Georgia, 'Playfair Display', serif;
    }
    .brand-tag {
      font-size: 11px;
      color: #d4d4d4;
      margin-top: 6px;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-family: monospace;
    }
    .order-status {
      text-align: right;
    }
    .status-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: #a35c49;
      color: #ffffff;
      padding: 5px 12px;
      font-family: monospace;
    }
    .order-meta-id {
      font-size: 12px;
      font-weight: 700;
      color: #ffffff;
      margin-top: 8px;
      font-family: monospace;
      letter-spacing: 0.05em;
    }
    .order-meta-date {
      font-size: 11px;
      color: #a3a3a3;
      margin-top: 3px;
      font-family: monospace;
    }
    .content-section {
      padding: 36px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 28px;
      margin-bottom: 32px;
      padding-bottom: 28px;
      border-bottom: 1px dashed #e6e6e2;
    }
    .meta-block h4 {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #737373;
      margin-bottom: 8px;
      font-family: monospace;
    }
    .meta-block p {
      font-size: 13px;
      color: #1a1a1a;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 28px;
    }
    th {
      padding: 12px 16px;
      text-align: left;
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #1a1a1a;
      border-bottom: 1px solid #1a1a1a;
      background: #f4f4f0;
      font-family: monospace;
    }
    th:nth-child(2) {
      text-align: center;
    }
    th:nth-child(3), th:nth-child(4) {
      text-align: right;
    }
    .summary-wrap {
      display: flex;
      justify-content: flex-end;
    }
    .summary-table {
      width: 320px;
      font-size: 13px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      color: #525252;
      font-family: monospace;
    }
    .summary-row.total {
      border-top: 2px solid #1a1a1a;
      margin-top: 8px;
      padding-top: 12px;
      font-size: 16px;
      font-weight: 700;
      color: #1a1a1a;
    }
    .stamp-container {
      margin-top: 28px;
      padding: 16px;
      border: 1px solid #e6e6e2;
      background: #f4f4f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .stamp-text {
      font-family: monospace;
      font-size: 11px;
      color: #525252;
    }
    .stamp-badge {
      font-family: monospace;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      color: #2b5b3c;
      border: 1px solid #2b5b3c;
      padding: 4px 8px;
      letter-spacing: 0.08em;
    }
    .footer-note {
      padding: 20px 36px;
      background: #f4f4f0;
      border-top: 1px solid #e6e6e2;
      text-align: center;
      font-size: 11px;
      font-family: monospace;
      color: #737373;
    }
    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .invoice-card {
        border: none;
        box-shadow: none;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <div class="header-bar">
      <div>
        <div class="brand-logo">CLOTHES™</div>
        <div class="brand-tag">Clothes™ Apparel Co. · Accessible Conscious Luxury</div>
      </div>
      <div class="order-status">
        <span class="status-badge">Cash on Delivery</span>
        <div class="order-meta-id">${safeOrderId}</div>
        <div class="order-meta-date">${formattedDate}</div>
      </div>
    </div>

    <div class="content-section">
      <div class="meta-grid">
        <div class="meta-block">
          <h4>Billed To</h4>
          <p><strong>${safeName}</strong></p>
          <p>${safeEmail}</p>
          <p>${safePhone}</p>
        </div>

        <div class="meta-block">
          <h4>Delivery Address</h4>
          <p style="white-space: pre-line;">${safeAddress}</p>
        </div>

        <div class="meta-block">
          <h4>Customer Care &amp; Terms</h4>
          <p>Doorstep Inspection Permitted</p>
          <p>Concierge: concierge@clothes.com</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Garment / Silhouette</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>

      <div class="summary-wrap">
        <div class="summary-table">
          <div class="summary-row">
            <span>Subtotal</span>
            <span>$${order.subtotal.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Sales Tax (8%)</span>
            <span>$${order.tax.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Standard Insured Shipping</span>
            <span style="color: #2b5b3c; font-weight: 700;">FREE</span>
          </div>
          <div class="summary-row total">
            <span>Total Payable</span>
            <span>$${order.total.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      <div class="stamp-container">
        <div class="stamp-text">
          AUTHENTICATED RECORD // CLOTHES™ MINIMALISM IN EVERYDAY WEAR
        </div>
        <div class="stamp-badge">
          VERIFIED ORDER
        </div>
      </div>
    </div>

    <div class="footer-note">
      Thank you for choosing Clothes™ Apparel Co. For assistance, contact concierge@clothes.com. 30-day returns accepted.
    </div>
  </div>
</body>
</html>`;
}
