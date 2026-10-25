"use client";

import Link from "next/link";

interface OrderStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { step: 1, label: "01 Shopping Bag", shortLabel: "01 Bag", href: "/cart" },
  { step: 2, label: "02 Delivery & Payment", shortLabel: "02 Checkout", href: "/checkout" },
  { step: 3, label: "03 Invoice & Receipt", shortLabel: "03 Invoice", href: "#" },
] as const;

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  return (
    <div className="mb-6 sm:mb-8 border-b border-border pb-3 sm:pb-4">
      <nav aria-label="Checkout Progress">
        <ol className="flex items-center gap-1.5 sm:gap-4 text-[11px] sm:text-xs font-mono overflow-x-auto scrollbar-none">
          {STEPS.map((item, idx) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;

            return (
              <li key={item.step} className="flex items-center gap-1.5 sm:gap-4 shrink-0">
                {idx > 0 && (
                  <span className="text-border-strong select-none text-[10px] sm:text-xs">/</span>
                )}
                {isCompleted ? (
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1 sm:gap-1.5 text-ink hover:text-ctrl-red transition-colors"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink group-hover:bg-ctrl-red" />
                    <span className="font-semibold underline underline-offset-4 decoration-border-strong hidden sm:inline">
                      {item.label}
                    </span>
                    <span className="font-semibold underline underline-offset-4 decoration-border-strong sm:hidden">
                      {item.shortLabel}
                    </span>
                  </Link>
                ) : isActive ? (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-ink font-bold tracking-wider">
                    <span className="inline-block h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-ctrl-red animate-pulse" />
                    <span className="bg-ink text-paper px-1.5 sm:px-2 py-0.5 uppercase tracking-widest text-[10px] sm:text-[11px]">
                      <span className="hidden sm:inline">{item.label}</span>
                      <span className="sm:hidden">{item.shortLabel}</span>
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 sm:gap-1.5 text-ink-soft">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-border-strong" />
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
