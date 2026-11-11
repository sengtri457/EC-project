"use client";

import React, { useState, useEffect, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { checkPaymentStatus, verifyPayment } from "@/lib/api";

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
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
      } catch (err) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-sm overflow-hidden border border-border bg-paper p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 text-center">
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
          <div className="mt-4 space-y-4">
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
                value={khqrPayload || "000201010212"}
                size={200}
                level="M"
                includeMargin={false}
              />
              <div className="mt-2 text-[10px] font-mono tracking-widest text-ink/70 font-semibold uppercase">
                National Bank of Cambodia
              </div>
            </div>

            {/* Timer and instructions */}
            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex items-center justify-center gap-2 text-ink">
                <span className="h-2 w-2 rounded-full bg-ctrl-red animate-ping" />
                <span className="font-bold">Awaiting Scan: {timeFormatted}</span>
              </div>
              <p className="text-[11px] text-ink-soft leading-tight">
                Open <strong>ABA Mobile</strong>, <strong>Wing</strong>, <strong>ACLEDA</strong>, or any Bakong app to scan and confirm.
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
              <button
                type="button"
                onClick={onClose}
                className="w-full border border-border bg-canvas py-2 text-xs font-mono text-ink-soft hover:text-ink transition-colors cursor-pointer"
              >
                Change Payment Method
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
