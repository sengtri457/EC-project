import { getCollectionPieces, getProducts } from "@/data/products";
import ClothingRack from "@/components/ClothingRack";
import PiecesList from "@/components/PiecesList";
import CatalogClient from "@/components/CatalogClient";

export default function Home() {
  const pieces = getCollectionPieces();
  const allProducts = getProducts();

  return (
    <div className="flex flex-col">
      {/* 1. Signature Clothes Rail Hero with Kinetic Spring Pendulum Physics */}
      <ClothingRack products={pieces} />

      {/* 2. The Pieces Editorial Section */}
      <PiecesList products={pieces} />

      {/* 3. Full Store Catalog with Search, Categories & Direct Product Detail Links */}
      <CatalogClient initialProducts={allProducts} />
    </div>
  );
}
