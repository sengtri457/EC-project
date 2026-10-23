"use client";

import Link from "next/link";

interface OrderStepperProps {
  currentStep: 1 | 2 | 3;
}

const STEPS = [
  { step: 1, label: "01 Bag", href: "/cart" },
  { step: 2, label: "02 Dispatch Slip", href: "/checkout" },
  { step: 3, label: "03 Receipt & Invoice", href: "#" },
] as const;

export default function OrderStepper({ currentStep }: OrderStepperProps) {
  return (
    <div className="mb-8 border-b border-ink/15 pb-4">
      <nav aria-label="Checkout Progress">
        <ol className="flex items-center gap-2 sm:gap-4 text-xs font-mono">
          {STEPS.map((item, idx) => {
            const isActive = item.step === currentStep;
            const isCompleted = item.step < currentStep;

            return (
              <li key={item.step} className="flex items-center gap-2 sm:gap-4">
                {idx > 0 && (
                  <span className="text-ink/30 select-none">/</span>
                )}
                {isCompleted ? (
                  <Link
                    href={item.href}
                    className="group flex items-center gap-1.5 text-ink hover:text-ctrl-red transition-colors"
                  >
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink group-hover:bg-ctrl-red" />
                    <span className="font-semibold underline underline-offset-4 decoration-ink/30">
                      {item.label}
                    </span>
                  </Link>
                ) : isActive ? (
                  <div className="flex items-center gap-1.5 text-ink font-bold tracking-wider">
                    <span className="inline-block h-2 w-2 rounded-full bg-ctrl-red animate-pulse" />
                    <span className="bg-ink text-paper px-2 py-0.5 uppercase tracking-widest text-[11px]">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-ink/40">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-ink/30" />
                    <span>{item.label}</span>
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
