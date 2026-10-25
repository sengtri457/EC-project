import { Order } from "@/types";
import { toKhr } from "./cambodiaLocations";

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
  const safeEmail = escapeHtml(order.customer.email || "customer@clothes-shop.com");
  const safePhone = escapeHtml(order.customer.phone);
  const safeTelegram = order.customer.telegram ? escapeHtml(order.customer.telegram) : "";
  const safeOrderId = escapeHtml(order.id);
  const safeTracking = escapeHtml(order.trackingNumber || `KH-${order.id.slice(-7)}`);

  const street = escapeHtml(order.customer.streetAddress || order.customer.address);
  const sangkat = order.customer.sangkatCommune ? escapeHtml(order.customer.sangkatCommune) : "";
  const khan = order.customer.khanDistrict ? escapeHtml(order.customer.khanDistrict) : "";
  const cityProv = escapeHtml(order.customer.cityProvince || "Phnom Penh");
  const landmark = order.customer.landmark ? escapeHtml(order.customer.landmark) : "";

  const shippingCost = typeof order.shippingCost === "number" ? order.shippingCost : 0;
  const shippingMethodName = order.customer.shippingMethod === "phnom_penh_express"
    ? "Phnom Penh Express (Same-Day Rider)"
    : order.customer.shippingMethod === "phnom_penh_standard"
    ? "Phnom Penh Standard Delivery"
    : `Provincial Delivery (${cityProv})`;

  const paymentMethodLabel = order.customer.paymentMethod === "khqr"
    ? "KHQR (Bakong / ABA Mobile)"
    : order.customer.paymentMethod === "cod"
    ? "Cash on Delivery (Pay to Rider)"
    : `Card Authorization (•••• ${order.customer.cardNumberLast4 || "4242"})`;

  const formattedDate = new Date(order.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const totalKhrString = toKhr(order.total);

  // NO ITEM IMAGES: purely typographic, compact, paper-clean table rows
  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 18px; border-bottom: 1px solid #ebebea; font-family: monospace; font-size: 11px; color: #888880;">
          CLO-${item.productId.toString().padStart(4, "0")}
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #ebebea; font-size: 13px; font-weight: 600; color: #111111;">
          ${escapeHtml(item.title)}
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #ebebea; font-size: 12px; text-align: center; color: #555555; font-family: monospace;">
          ${item.quantity}
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #ebebea; font-size: 12px; text-align: right; color: #555555; font-family: monospace;">
          $${item.price.toFixed(2)}
        </td>
        <td style="padding: 14px 18px; border-bottom: 1px solid #ebebea; font-size: 13px; text-align: right; font-weight: 700; color: #111111; font-family: monospace;">
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
  <title>Tax Invoice ${safeOrderId} — Clothes™ Cambodia</title>
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      background-color: #f7f7f5;
      color: #1a1a1a;
      padding: 40px 16px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }
    .invoice-card {
      max-width: 780px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e2df;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.04);
    }
    .header-bar {
      padding: 32px 36px;
      border-bottom: 2px solid #1a1a1a;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 20px;
      background: #fafaf8;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-logo-emblem {
      width: 48px;
      height: 48px;
      background: #111111;
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: Georgia, serif;
      font-size: 24px;
      font-weight: bold;
      border-radius: 4px;
      letter-spacing: -0.05em;
    }
    .brand-text-title {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.02em;
      color: #111111;
      font-family: Georgia, serif;
    }
    .brand-text-sub {
      font-size: 11px;
      color: #777772;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 2px;
      font-family: monospace;
    }
    .order-badge {
      padding: 6px 12px;
      background: #111111;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: monospace;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      border-bottom: 1px solid #ebebea;
      background: #ffffff;
    }
    .meta-cell {
      padding: 16px 24px;
      border-right: 1px solid #ebebea;
    }
    .meta-cell:last-child {
      border-right: none;
    }
    .meta-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #888880;
      font-family: monospace;
      margin-bottom: 3px;
    }
    .meta-value {
      font-size: 12px;
      font-weight: 600;
      color: #111111;
      word-break: break-all;
    }
    .address-section {
      display: grid;
      grid-template-columns: 1fr 1fr;
      padding: 24px 36px;
      border-bottom: 1px solid #ebebea;
      gap: 36px;
      background: #ffffff;
    }
    .section-title {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #888880;
      font-family: monospace;
      margin-bottom: 6px;
    }
    .recipient-name {
      font-size: 14px;
      font-weight: 700;
      color: #111111;
      margin-bottom: 3px;
    }
    .address-text {
      font-size: 12px;
      color: #555550;
      line-height: 1.45;
    }
    .table-container {
      width: 100%;
      border-collapse: collapse;
    }
    .table-head th {
      padding: 12px 18px;
      background: #fafaf8;
      border-bottom: 1px solid #e2e2df;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #666660;
      font-family: monospace;
      font-weight: 600;
    }
    .totals-area {
      padding: 24px 36px;
      border-top: 1px solid #e2e2df;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      background: #ffffff;
    }
    .totals-box {
      width: 280px;
    }
    .totals-row {
      display: flex;
      justify-content: space-between;
      font-size: 12px;
      font-family: monospace;
      color: #555550;
      margin-bottom: 6px;
    }
    .totals-row.final {
      border-top: 2px solid #111111;
      padding-top: 10px;
      margin-top: 10px;
      align-items: baseline;
    }
    .total-title {
      font-size: 12px;
      text-transform: uppercase;
      font-weight: 700;
      color: #111111;
    }
    .total-khr {
      font-size: 11px;
      color: #777770;
      display: block;
      margin-top: 2px;
    }
    .total-usd {
      font-size: 20px;
      font-weight: 700;
      color: #111111;
      font-family: -apple-system, BlinkMacSystemFont, sans-serif;
    }
    .footer-bar {
      padding: 20px 36px;
      background: #fafaf8;
      border-top: 1px solid #ebebea;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: #777772;
      font-family: monospace;
    }
    .print-bar {
      max-width: 780px;
      margin: 16px auto 0 auto;
      text-align: right;
    }
    .print-btn {
      display: inline-block;
      padding: 9px 18px;
      background: #111111;
      color: #ffffff;
      font-size: 11px;
      font-weight: 600;
      border: none;
      cursor: pointer;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-family: monospace;
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
      .print-bar {
        display: none !important;
      }
    }
    @media (max-width: 640px) {
      .header-bar { flex-direction: column; align-items: flex-start; padding: 20px; }
      .meta-grid { grid-template-columns: 1fr 1fr; }
      .address-section { grid-template-columns: 1fr; padding: 20px; gap: 16px; }
      .totals-area { flex-direction: column; align-items: stretch; padding: 20px; gap: 16px; }
      .totals-box { width: 100%; }
      .footer-bar { flex-direction: column; gap: 8px; text-align: center; }
    }
  </style>
</head>
<body>
  <div class="invoice-card">
    <!-- Header with Brand Logo -->
    <div class="header-bar">
      <div class="brand-section">
        <div class="brand-logo-emblem">C</div>
        <div>
          <div class="brand-text-title">Clothes™ Apparel Co.</div>
          <div class="brand-text-sub">Phnom Penh, Cambodia &bull; Official Tax Invoice</div>
        </div>
      </div>
      <div>
        <span class="order-badge">Confirmed Order</span>
      </div>
    </div>

    <!-- Metadata Grid -->
    <div class="meta-grid">
      <div class="meta-cell">
        <div class="meta-label">Invoice Reference</div>
        <div class="meta-value">${safeOrderId}</div>
      </div>
      <div class="meta-cell">
        <div class="meta-label">Date Issued</div>
        <div class="meta-value">${formattedDate}</div>
      </div>
      <div class="meta-cell">
        <div class="meta-label">Courier Tracking</div>
        <div class="meta-value" style="font-family: monospace;">${safeTracking}</div>
      </div>
      <div class="meta-cell">
        <div class="meta-label">Payment Mode</div>
        <div class="meta-value">${escapeHtml(paymentMethodLabel.split("(")[0].trim())}</div>
      </div>
    </div>

    <!-- Address Section -->
    <div class="address-section">
      <div>
        <div class="section-title">Delivery Destination</div>
        <div class="recipient-name">${safeName}</div>
        <div class="address-text">${street}</div>
        ${sangkat ? `<div class="address-text">Sangkat ${sangkat}${khan ? `, Khan ${khan}` : ""}</div>` : ""}
        <div class="address-text">${cityProv}, Cambodia</div>
        ${landmark ? `<div class="address-text" style="font-style: italic; color: #777; margin-top: 3px;">Landmark: "${landmark}"</div>` : ""}
      </div>
      <div>
        <div class="section-title">Courier &amp; Recipient Coordination</div>
        <div style="font-size: 12px; color: #111; font-weight: 600;">Phone: ${safePhone}</div>
        ${safeTelegram ? `<div style="font-size: 12px; color: #555; margin-top: 3px;">Telegram: <strong>${safeTelegram}</strong></div>` : ""}
        <div style="font-size: 12px; color: #555; margin-top: 3px;">Service: ${escapeHtml(shippingMethodName)}</div>
        <div style="font-size: 11px; color: #777; margin-top: 3px;">Notification: ${safeEmail}</div>
      </div>
    </div>

    <!-- Itemized Table (NO ITEM IMAGES) -->
    <table class="table-container">
      <thead class="table-head">
        <tr>
          <th style="text-align: left; width: 100px;">SKU</th>
          <th style="text-align: left;">Item Description</th>
          <th style="text-align: center; width: 70px;">Qty</th>
          <th style="text-align: right; width: 100px;">Unit Price</th>
          <th style="text-align: right; width: 110px;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Totals Area -->
    <div class="totals-area">
      <div>
        <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; color: #888; font-family: monospace;">
          Customer Service Support
        </div>
        <div style="font-size: 11px; color: #555; margin-top: 3px;">
          Telephone: 012 345 678 &bull; Telegram: @clothescambodia
        </div>
        <div style="font-size: 11px; color: #777; margin-top: 2px;">
          Show this digital slip to the courier upon doorstep receipt.
        </div>
      </div>

      <div class="totals-box">
        <div class="totals-row">
          <span>Subtotal</span>
          <span>$${order.subtotal.toFixed(2)} USD</span>
        </div>
        <div class="totals-row">
          <span>Delivery Fee</span>
          <span>${shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)} USD`}</span>
        </div>
        <div class="totals-row final">
          <div>
            <span class="total-title">Total Due</span>
            <span class="total-khr">≈ ${totalKhrString}</span>
          </div>
          <span class="total-usd">$${order.total.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="footer-bar">
      <div>Clothes™ Apparel Co. &bull; Phnom Penh, Cambodia</div>
      <div>Official Customer Receipt</div>
    </div>
  </div>

  <div class="print-bar">
    <button onclick="window.print()" class="print-btn">Print Receipt</button>
  </div>
</body>
</html>`;
}
