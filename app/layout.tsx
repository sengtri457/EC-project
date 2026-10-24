import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export const metadata: Metadata = {
  title: "Clothes™ — Accessible Conscious Luxury | Minimalism in Everyday Wear",
  description:
    "Curated wardrobe essentials crafted from tactile sustainable fabrics and timeless silhouettes. Accessible conscious luxury designed for modern living.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased font-sans">
      <body className="flex min-h-full flex-col bg-backdrop text-ink font-sans selection:bg-terracotta selection:text-paper overflow-x-hidden">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <Toast />
        </CartProvider>
      </body>
    </html>
  );
}
