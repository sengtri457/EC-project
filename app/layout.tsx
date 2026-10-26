import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Clothes™ Accessible Conscious Luxury | Minimalism in Everyday Wear",
  description:
    "Curated wardrobe essentials crafted from tactile sustainable fabrics and timeless silhouettes. Accessible conscious luxury designed for modern living.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <body
        className="flex min-h-full flex-col bg-backdrop text-ink font-sans selection:bg-terracotta selection:text-paper overflow-x-hidden"
        suppressHydrationWarning
      >
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <Toast />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
