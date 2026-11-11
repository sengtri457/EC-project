"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { checkPaymentStatus, verifyPayment } from "@/lib/api";
import { buildBakongKhqr, extractAccountIdFromKhqr } from "@/lib/khqr";

interface KhqrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderNumber: string) => void;
  paymentId: string;
  orderNumber: string;
  khqrPayload: string;
  amountUsd: number;
  amountKhr: number;
}

export default function KhqrModal({
  isOpen,
  onClose,
  onSuccess,
  paymentId,
  orderNumber,
  khqrPayload,
  amountUsd,
  amountKhr,
}: KhqrModalProps) {
  const [secondsRemaining, setSecondsRemaining] = useState(300); // 5 minutes
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // Custom account override for testing with real personal ABA / Bakong accounts
  const [customAccount, setCustomAccount] = useState("");
  const [isCustomizing, setIsCustomizing] = useState(false);

  const detectedBackendAccount = React.useMemo(() => {
    return extractAccountIdFromKhqr(khqrPayload);
  }, [khqrPayload]);

  const displayAccount = customAccount || detectedBackendAccount || "Official Merchant";

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Compute active QR payload (either from backend, or dynamically for user's personal Bakong account)
  const activePayload = React.useMemo(() => {
    if (customAccount.trim()) {
      return buildBakongKhqr({
        accountId: customAccount.trim(),
        merchantName: "Clothes Store",
        merchantCity: "Phnom Penh",
        amount: amountUsd,
        currency: "USD",
        billNumber: orderNumber,
      }).qr;
    }
    if (khqrPayload) return khqrPayload;
    return buildBakongKhqr({
      accountId: "clothes@abaa",
      merchantName: "Clothes Store",
      merchantCity: "Phnom Penh",
      amount: amountUsd,
      currency: "USD",
      billNumber: orderNumber,
    }).qr;
  }, [customAccount, khqrPayload, amountUsd, orderNumber]);

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isPaid) return;
    setSecondsRemaining(300);

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isPaid]);

  // Polling loop to check if customer scanned and completed payment
  useEffect(() => {
    if (!isOpen || !paymentId || isPaid) return;

    const poll = async () => {
      try {
        const result = await checkPaymentStatus(paymentId);
        if (result.status === "COMPLETED") {
          setIsPaid(true);
          if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
          setTimeout(() => {
            onSuccess(orderNumber);
          }, 1200);
        }
      } catch {
        // Silent failure during polling to avoid interrupting customer experience
      }
    };

    poll();
    pollIntervalRef.current = setInterval(poll, 3000);

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isOpen, paymentId, isPaid, orderNumber, onSuccess]);

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

  // Manual instant verification trigger for user testing
  const handleInstantVerify = async () => {
    setIsVerifying(true);
    setErrorMessage(null);
    try {
      await verifyPayment(paymentId);
      setIsPaid(true);
      setTimeout(() => {
        onSuccess(orderNumber);
      }, 1000);
    } catch (err: any) {
      setErrorMessage(err.message || "Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(activePayload);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden border border-border bg-paper p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="bg-ctrl-red text-paper font-mono font-bold text-[10px] px-2 py-0.5 tracking-wider uppercase">
              KHQR
            </span>
            <span className="type-label text-xs uppercase tracking-widest text-ink font-semibold">
              Bakong Dynamic QR
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink text-sm font-mono cursor-pointer p-1"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Content State */}
        {isPaid ? (
          <div className="py-12 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-forest text-paper text-2xl font-bold animate-bounce">
              ✓
            </div>
            <h3 className="type-display text-xl font-bold text-ink">Payment Confirmed!</h3>
            <p className="text-xs font-mono text-ink-soft">
              Settled via NBC Bakong Network. Generating official receipt...
            </p>
          </div>
        ) : (
          <div className="mt-4 space-y-3.5">
            {/* Amount details */}
            <div>
              <span className="text-2xl font-mono font-extrabold text-ink">
                ${amountUsd.toFixed(2)} USD
              </span>
              <p className="text-xs font-mono text-terracotta font-semibold mt-0.5">
                ≈ {amountKhr.toLocaleString()} KHR
              </p>
              <p className="text-[11px] font-mono text-ink-soft mt-1">
                Ref: <span className="font-bold text-ink">{orderNumber}</span>
              </p>
            </div>

            {/* QR Code Container */}
            <div className="mx-auto inline-flex flex-col items-center justify-center p-3 bg-white border-2 border-ink shadow-sm">
              <QRCodeSVG
                value={activePayload}
                size={190}
                level="M"
                includeMargin={false}
              />
              <div className="mt-2 text-[10px] font-mono tracking-widest text-ink/70 font-semibold uppercase">
                National Bank of Cambodia
              </div>
            </div>

            {/* Account Info Pill */}
            <div className="bg-canvas border border-border px-3 py-1.5 text-[11px] font-mono text-ink-soft flex items-center justify-between">
              <span className="truncate">
                Merchant: <strong className="text-ink">{displayAccount}</strong>
              </span>
              <button
                type="button"
                onClick={() => setIsCustomizing((prev) => !prev)}
                className="text-ctrl-red hover:underline text-[10px] uppercase font-semibold shrink-0 ml-2 cursor-pointer"
              >
                {isCustomizing ? "Close" : "Override"}
              </button>
            </div>

            {/* Optional Custom Account Input for Real App Scanning */}
            {isCustomizing && (
              <div className="bg-canvas border border-border p-3 text-left space-y-2 text-xs font-mono">
                <label className="text-[10px] font-semibold uppercase text-ink block">
                  Scan with your real Bank App:
                </label>
                <p className="text-[10px] text-ink-soft leading-tight">
                  Standard bank apps (ABA, Wing, Bakong) require an account registered with NBC. Enter your personal Bakong/ABA ID to scan and verify:
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customAccount}
                    onChange={(e) => setCustomAccount(e.target.value)}
                    placeholder="e.g. yourname@abaa"
                    className="flex-1 border border-border bg-paper px-2.5 py-1.5 text-xs text-ink focus:border-ink outline-none"
                  />
                  {customAccount && (
                    <button
                      type="button"
                      onClick={() => setCustomAccount("")}
                      className="text-[10px] text-ink-soft hover:text-ink px-1"
                    >
                      Reset
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Timer and instructions */}
            <div className="space-y-1 font-mono text-xs">
              <div className="flex items-center justify-center gap-2 text-ink">
                <span className="h-2 w-2 rounded-full bg-ctrl-red animate-ping" />
                <span className="font-bold">Awaiting Scan: {timeFormatted}</span>
              </div>
              <p className="text-[11px] text-ink-soft leading-tight">
                Scan with <strong>ABA Mobile</strong>, <strong>Wing</strong>, <strong>ACLEDA</strong>, or any Bakong app.
              </p>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <p className="text-xs font-mono text-ctrl-red">{errorMessage}</p>
            )}

            {/* Action buttons */}
            <div className="pt-2 border-t border-border space-y-2">
              <button
                type="button"
                onClick={handleInstantVerify}
                disabled={isVerifying}
                className="w-full bg-ink text-paper py-2.5 text-xs font-mono uppercase tracking-wider font-semibold hover:bg-ink-soft transition-colors cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? "Verifying..." : "⚡ Simulate Scan & Pay (Test Mode)"}
              </button>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="flex-1 border border-border bg-canvas py-1.5 text-[11px] font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
                >
                  {copied ? "✓ Copied Payload" : "Copy Payload String"}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 border border-border bg-canvas py-1.5 text-[11px] font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
