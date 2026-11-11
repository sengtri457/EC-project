/**
 * National Bank of Cambodia (NBC) Bakong KHQR EMVCo Generator
 * Conforms strictly to EMVCo Merchant-Presented Mode specifications & NBC guidelines.
 */

export function crc16Ccitt(data: string): string {
  let crc = 0xffff;
  const bytes = new TextEncoder().encode(data);
  for (let i = 0; i < bytes.length; i++) {
    crc ^= bytes[i] << 8;
    for (let j = 0; j < 8; j++) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatTlv(tag: string, value: string): string {
  const valueBytes = new TextEncoder().encode(value);
  const lenStr = valueBytes.length.toString().padStart(2, "0");
  return `${tag}${lenStr}${value}`;
}

export interface KhqrOptions {
  accountId: string; // e.g. "sengtri@abaa" or "012345678@abaa"
  merchantName?: string;
  merchantCity?: string;
  amount: number;
  currency?: "USD" | "KHR";
  billNumber?: string;
  storeLabel?: string;
  phoneNumber?: string;
  expirationDays?: number;
}

/**
 * Builds an official EMVCo Dynamic KHQR string recognized by ABA Mobile, Bakong, Wing, ACLEDA, etc.
 */
export function buildBakongKhqr(options: KhqrOptions): { qr: string; md5?: string } {
  const {
    accountId,
    merchantName = "Clothes Store",
    merchantCity = "Phnom Penh",
    amount,
    currency = "USD",
    billNumber = "",
    storeLabel = "Clothes Store",
    phoneNumber = "",
    expirationDays = 1,
  } = options;

  // Tag 00: Payload Format Indicator (01)
  let payload = formatTlv("00", "01");

  // Tag 01: Initiation method (12 = Dynamic QR)
  payload += formatTlv("01", "12");

  // Tag 29: Merchant Account Info for Individual / Solo Bakong Accounts
  // Sub-tag 00 contains the registered Bakong Account ID only
  const subTag00 = formatTlv("00", accountId.trim());
  payload += formatTlv("29", subTag00);

  // Tag 52: Merchant Category Code (5999 for retail / apparel)
  payload += formatTlv("52", "5999");

  // Tag 53: Transaction Currency (840 = USD, 116 = KHR)
  const currencyCode = currency.toUpperCase() === "USD" ? "840" : "116";
  payload += formatTlv("53", currencyCode);

  // Tag 54: Transaction Amount (stripped trailing zeros per NBC specification)
  let amountStr = amount.toFixed(2).replace(/\.?0+$/, "");
  if (!amountStr || amountStr === "0") amountStr = "1";
  payload += formatTlv("54", amountStr);

  // Tag 58: Country Code (KH)
  payload += formatTlv("58", "KH");

  // Tag 59: Merchant Name (max 25 chars)
  payload += formatTlv("59", merchantName.slice(0, 25));

  // Tag 60: Merchant City (max 15 chars)
  payload += formatTlv("60", merchantCity.slice(0, 15));

  // Tag 62: Additional Data Field Template (Store label, Bill reference, Mobile)
  let addData = "";
  if (storeLabel) {
    addData += formatTlv("03", storeLabel.slice(0, 25));
  }
  if (billNumber) {
    addData += formatTlv("01", billNumber.slice(0, 25));
  }
  if (phoneNumber) {
    addData += formatTlv("02", phoneNumber.slice(0, 25));
  }
  if (addData) {
    payload += formatTlv("62", addData);
  }

  // Tag 99: NBC Millisecond Timestamp & Expiration
  const nowMs = Date.now();
  const expMs = nowMs + expirationDays * 86400 * 1000;
  const tag99Sub00 = formatTlv("00", String(nowMs));
  const tag99Sub01 = formatTlv("01", String(expMs));
  payload += formatTlv("99", tag99Sub00 + tag99Sub01);

  // Tag 63: Checksum
  const preCrc = payload + "6304";
  const checksum = crc16Ccitt(preCrc);

  return { qr: preCrc + checksum };
}
