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
        <td style="padding: 12px 14px; border-bottom: 1px solid #ececec; font-size: 13px; font-weight: 500; color: #1a1a1a; font-family: -apple-system, BlinkMacSystemFont, sans-serif;">
          ${escapeHtml(item.title)}
        </td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #ececec; font-size: 12px; text-align: center; color: #6b7280; font-family: monospace;">
          ${item.quantity}
        </td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #ececec; font-size: 12px; text-align: right; color: #6b7280; font-family: monospace;">
          $${item.price.toFixed(2)}
        </td>
        <td style="padding: 12px 14px; border-bottom: 1px solid #ececec; font-size: 12px; text-align: right; font-weight: 600; color: #1a1a1a; font-family: monospace;">
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
      padding: 40px 16px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-card {
      max-width: 740px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #ececec;
      overflow: hidden;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    }
    .header-bar {
      padding: 28px 32px;
      border-bottom: 1px solid #ececec;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      background: #fafaf8;
    }
    .brand-logo {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: -0.01em;
      color: #1a1a1a;
      line-height: 1.2;
      font-family: Georgia, 'Playfair Display', serif;
    }
    .brand-tag {
      font-size: 11px;
      color: #6b7280;
      margin-top: 3px;
    }
    .order-status {
      text-align: right;
    }
    .status-badge {
      display: inline-block;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: #fdf5f3;
      color: #a35c49;
      border: 1px solid rgba(163, 92, 73, 0.25);
      padding: 3px 8px;
      border-radius: 3px;
      font-family: monospace;
    }
    .order-meta-id {
      font-size: 11px;
      font-weight: 600;
      color: #1a1a1a;
      margin-top: 5px;
      font-family: monospace;
      letter-spacing: 0.04em;
    }
    .order-meta-date {
      font-size: 11px;
      color: #6b7280;
      margin-top: 2px;
      font-family: monospace;
    }
    .content-section {
      padding: 32px;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 20px;
      margin-bottom: 28px;
      padding-bottom: 24px;
      border-bottom: 1px solid #ececec;
    }
    .meta-block h4 {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 6px;
      font-family: monospace;
    }
    .meta-block p {
      font-size: 12px;
      color: #1a1a1a;
      line-height: 1.6;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    th {
      padding: 10px 14px;
      text-align: left;
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #6b7280;
      border-bottom: 1px solid #ececec;
      background: #fafaf8;
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
      width: 280px;
      font-size: 12px;
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      padding: 5px 0;
      color: #6b7280;
      font-family: monospace;
    }
    .summary-row.total {
      border-top: 1px solid #ececec;
      margin-top: 6px;
      padding-top: 10px;
      font-size: 14px;
      font-weight: 600;
      color: #1a1a1a;
    }
    .footer-note {
      padding: 18px 32px;
      background: #fafaf8;
      border-top: 1px solid #ececec;
      text-align: center;
      font-size: 11px;
      font-family: monospace;
      color: #6b7280;
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
        <div class="brand-logo">Clothes™ Apparel Co.</div>
        <div class="brand-tag">Accessible Conscious Luxury · Official Order Invoice</div>
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
          <h4>Delivery Destination</h4>
          <p style="white-space: pre-line;">${safeAddress}</p>
        </div>

        <div class="meta-block">
          <h4>Delivery &amp; Care</h4>
          <p>Doorstep Inspection Permitted</p>
          <p>Concierge: concierge@clothes.com</p>
          <p style="color: #2b5b3c; font-size: 11px; margin-top: 3px;">30-Day Hassle-Free Returns</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Item / Silhouette</th>
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
            <span>Estimated Sales Tax (8%)</span>
            <span>$${order.tax.toFixed(2)}</span>
          </div>
          <div class="summary-row">
            <span>Standard Shipping</span>
            <span style="color: #2b5b3c; font-weight: 600;">FREE</span>
          </div>
          <div class="summary-row total">
            <span>Total Payable</span>
            <span>$${order.total.toFixed(2)} USD</span>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-note">
      Thank you for your order with Clothes™ Apparel Co. · concierge@clothes.com
    </div>
  </div>
</body>
</html>`;
}
