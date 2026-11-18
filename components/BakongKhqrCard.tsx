"use client";

import React from "react";
import { QRCodeSVG } from "qrcode.react";

export interface BakongKhqrCardProps {
  payload: string;
  merchantName?: string;
  currency?: "USD" | "KHR";
  size?: number;
  className?: string;
}

/**
 * Official NBC Bakong KHQR Wordmark SVG
 * Matching the exact geometric font and glyph shapes used by National Bank of Cambodia
 */
function KhqrLogoWordmark({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 110 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="KHQR"
    >
      {/* K */}
      <path
        d="M6 3H10.5V21H6V3ZM11 12.8L18.8 3H24.5L15.2 13.5L25 21H19.2L11 14.2V21H6.5V12.8H11Z"
        fill="#FFFFFF"
      />
      {/* H */}
      <path
        d="M29 3H33.5V10.2H42.5V3H47V21H42.5V13.8H33.5V21H29V3Z"
        fill="#FFFFFF"
      />
      {/* Q (Rounded square outer with square dot inside) */}
      <rect
        x="52"
        y="3"
        width="18"
        height="18"
        rx="3.5"
        stroke="#FFFFFF"
        strokeWidth="3.8"
        fill="none"
      />
      <rect x="58.5" y="9.5" width="5" height="5" rx="1" fill="#FFFFFF" />
      {/* R */}
      <path
        d="M76 3H86C90.2 3 93.2 5.5 93.2 9.2C93.2 12.2 91 14.3 87.8 15L94 21H88.5L82.8 15.2H80.5V21H76V3ZM80.5 6.6V11.8H85.5C87.6 11.8 88.8 10.8 88.8 9.2C88.8 7.6 87.6 6.6 85.5 6.6H80.5Z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

/**
 * Centered Khmer Riel Badge SVG Data URI
 * High-precision vector math matching official NBC Bakong KHQR center emblem:
 * Solid black circle, white outer ring border, white Khmer Riel glyph (៛)
 */
const RIEL_CENTER_BADGE_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
    <circle cx="50" cy="50" r="46" fill="#000000" stroke="#FFFFFF" stroke-width="6.5" />
    <g transform="translate(50, 52) scale(0.046, -0.046) translate(-270, -600)" fill="#FFFFFF">
      <path d="M388 531V102Q388 0 238 0H59V138Q200 138 200 185V531H50V669H200V806L95 905L43 955Q12 984 12 1012Q12 1033 28 1053L65 1102L140 1200H388V1062H140L388 840V669H488V531Z" />
    </g>
  </svg>`
)}`;

/**
 * BakongKhqrCard
 * 1:1 reproduction of the official NBC Bakong KHQR standee / mobile card design
 */
export default function BakongKhqrCard({
  payload,
  merchantName,
  size = 220,
  className = "",
}: BakongKhqrCardProps) {
  // Resolve merchant name: prioritize prop -> env -> fallback
  const resolvedMerchantName =
    merchantName ||
    process.env.NEXT_PUBLIC_BAKONG_MERCHANT_NAME ||
    process.env.BAKONG_MERCHANT_NAME ||
    "Maneth Pak";

  const badgeSize = Math.round(size * 0.17);

  return (
    <div
      className={`relative bg-white rounded-2xl md:rounded-[22px] shadow-lg border border-gray-100 overflow-hidden text-left mx-auto select-none ${className}`}
      style={{ maxWidth: size + 70 }}
    >
      {/* 1. Red Header Banner with Official KHQR Logo & Diagonal Ribbon Corner */}
      <div className="relative bg-[#E11E26] h-11 md:h-12 flex items-center justify-center px-4">
        <KhqrLogoWordmark className="h-4 md:h-4.5 w-auto" />

        {/* Diagonal Ribbon Fold on top-right corner matching official NBC template */}
        <div
          className="absolute right-0 top-full w-0 h-0 border-t-[14px] border-t-[#E11E26] border-l-[14px] border-l-transparent z-10 pointer-events-none"
          aria-hidden="true"
        />
      </div>

      {/* 2. Merchant Name Header (Strictly NO account ID shown) */}
      <div className="px-5 pt-3.5 pb-2">
        <div className="text-gray-800 text-[13px] md:text-sm font-medium tracking-normal truncate">
          {resolvedMerchantName}
        </div>
      </div>

      {/* 3. Dotted / Dashed Perforation Line */}
      <div className="border-b border-dashed border-gray-200 mx-5 my-1" />

      {/* 4. QR Code with White Margin & Center Emblem */}
      <div className="p-4 md:p-5 flex items-center justify-center bg-white">
        <QRCodeSVG
          value={payload}
          size={size}
          level="Q"
          includeMargin={false}
          imageSettings={{
            src: RIEL_CENTER_BADGE_SVG,
            height: badgeSize,
            width: badgeSize,
            excavate: true,
          }}
        />
      </div>

      {/* 5. Clean Bottom Margin */}
      <div className="pb-3 md:pb-4" />
    </div>
  );
}
