import { Product } from "@/types";

export const products: Product[] = [
  {
    id: 1,
    slug: "raw-denim-jacket",
    title: "Raw Denim Jacket",
    description:
      "Relaxed-fit raw denim jacket featuring double pleated chest panels, silver rivet hardware, and vintage wash texture.",
    price: 220.0,
    stock: 20,
    thumbnail: "/collection/ctrl-blazer.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Washed Blue & Washed Black",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 700,
    imageHeight: 1000,
  },
  {
    id: 2,
    slug: "rhinestone-denim",
    title: "Rhinestone Denim",
    description:
      "Curved silhouette relaxed denim pants with scattered hand-pressed tonal rhinestone embellishments.",
    price: 245.0,
    stock: 15,
    thumbnail: "/collection/ctrl-jeans.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Washed Blue & Washed Black",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 620,
    imageHeight: 1072,
  },
  {
    id: 3,
    slug: "thermal-long-sleeve",
    title: "Thermal Long Sleeve",
    description:
      "Heavyweight waffle-knit thermal with dynamic flared sleeve draping and flatlock reinforced stitching.",
    price: 95.0,
    stock: 30,
    thumbnail: "/collection/ctrl-sweater.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "tshirt",
    fabric: "White & Vintage Green",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 682,
    imageHeight: 961,
  },
  {
    id: 4,
    slug: "cropped-zip-hoodie",
    title: "Cropped Zip Hoodie",
    description:
      "Sunfaded heavyweight cotton fleece cut with an exaggerated cropped hem, wide boxy body, and matte gunmetal zipper.",
    price: 185.0,
    stock: 22,
    thumbnail: "/collection/ctrl-hoodie.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "hoodies",
    fabric: "Sunfaded Black",
    sizes: ["XS", "S", "M", "L"],
    imageWidth: 732,
    imageHeight: 1024,
  },
  {
    id: 5,
    slug: "olive-canvas-field-jacket",
    title: "Olive Canvas Field Jacket",
    description:
      "Structured utility field jacket in muted olive green canvas with brass buttons and front flap pockets.",
    price: 260.0,
    stock: 14,
    thumbnail: "/collection/rack-field-jacket.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Heavyweight Washed Olive Canvas",
    sizes: ["M", "L", "XL"],
    imageWidth: 680,
    imageHeight: 980,
  },
  {
    id: 6,
    slug: "baggy-denim-pants",
    title: "Baggy Denim Pants",
    description:
      "Ultra-wide leg 14oz denim with natural vintage whisker fading and exaggerated pooling stack at the ankle.",
    price: 210.0,
    stock: 25,
    thumbnail: "/collection/ctrl-jeans.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Washed Black & Washed Blue",
    sizes: ["28", "30", "32", "34", "36"],
    imageWidth: 520,
    imageHeight: 1072,
  },
  {
    id: 7,
    slug: "drop-shoulder-hoodie",
    title: "Drop Shoulder Hoodie",
    description:
      "Signature double-layered seamless hood with deep dropped armholes and structured heavyweight fleece hand-feel.",
    price: 165.0,
    stock: 40,
    thumbnail: "/collection/ctrl-hoodie.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "hoodies",
    fabric: "25+ Colorways",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 732,
    imageHeight: 1024,
  },
  {
    id: 8,
    slug: "quarter-zip-pullover",
    title: "1/4 Zip Pullover",
    description:
      "Clean standing mock collar pullover with hidden zipper placket and brushed interior insulating fleece.",
    price: 140.0,
    stock: 35,
    thumbnail: "/collection/ctrl-sweater.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Black, Espresso, Grey, Charcoal, Navy",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 682,
    imageHeight: 961,
  },
  {
    id: 9,
    slug: "plaid-quarter-zip",
    title: "Plaid 1/4 Zip",
    description:
      "Contrast tartan plaid collar detail paired with relaxed heather fleece and raw cut cuff binding.",
    price: 155.0,
    stock: 18,
    thumbnail: "/collection/ctrl-sweater.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Grey & Black",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 682,
    imageHeight: 961,
  },

  // ===================== 11: FOOTWEAR =====================
  {
    id: 11,
    slug: "nitro-track-runners",
    title: "Nitro Track Runners",
    description:
      "Engineered responsive cushioning with carbon-plate stability and high-abrasion rubber lug tread.",
    price: 175.0,
    stock: 18,
    thumbnail: "/products/shoe-nitro-runner.webp",
    category: "Shoes",
    audience: "men",
    department: "shoes",
    subcategory: "running",
    fabric: "Breathable engineered mesh & TPU",
    sizes: ["8", "9", "10", "11", "12"],
  },

  // ===================== 17-18: WOMEN =====================
  {
    id: 17,
    slug: "cropped-distressed-knit",
    title: "Cropped Distressed Knit",
    description:
      "Wide-neck loose knit sweater with frayed cropped hem and elongated slouchy sleeves.",
    price: 175.0,
    stock: 16,
    thumbnail: "/collection/ctrl-sweater.webp",
    category: "Clothes",
    audience: "women",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Heavyweight wool blend",
    sizes: ["XS", "S", "M", "L"],
    imageWidth: 682,
    imageHeight: 961,
  },
  {
    id: 18,
    slug: "vintage-washed-zip-hoodie",
    title: "Vintage Washed Zip Hoodie",
    description:
      "Boxy cropped silhouette with double zipper hardware and distressed vintage pigment dye.",
    price: 155.0,
    stock: 19,
    thumbnail: "/collection/ctrl-hoodie.webp",
    category: "Clothes",
    audience: "women",
    department: "clothes",
    subcategory: "hoodies",
    fabric: "450gsm French Terry",
    sizes: ["XS", "S", "M", "L"],
    imageWidth: 732,
    imageHeight: 1024,
  },

  // ===================== 26-27: KIDS =====================
  {
    id: 26,
    slug: "youth-mini-fleece-hoodie",
    title: "Youth Clothes™ Mini Fleece Hoodie",
    description:
      "Cozy fleece pullover hoodie tailored with reinforced seams, kangaroo pocket, and soft fleece lining.",
    price: 75.0,
    stock: 25,
    thumbnail: "/collection/ctrl-hoodie.webp",
    category: "Clothes",
    audience: "kids",
    department: "clothes",
    subcategory: "hoodies",
    fabric: "Cotton-Poly Soft Fleece",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    imageWidth: 732,
    imageHeight: 1024,
  },
  {
    id: 27,
    slug: "kids-chunky-rib-crew-sweater",
    title: "Kids Chunky Rib Crew Sweater",
    description:
      "Warm and itch-free cotton-wool blend knit with ribbed cuffs and collar.",
    price: 80.0,
    stock: 20,
    thumbnail: "/collection/ctrl-sweater.webp",
    category: "Clothes",
    audience: "kids",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Soft Combed Cotton Knit",
    sizes: ["4Y", "6Y", "8Y", "10Y", "12Y"],
    imageWidth: 682,
    imageHeight: 961,
  },
  {
    id: 34,
    slug: "charcoal-pleated-trouser",
    title: "Charcoal Pleated Trouser",
    description:
      "Full-length high-twist charcoal grey pleated dress trousers with architectural drape and sharp pressed creases.",
    price: 195.0,
    stock: 18,
    thumbnail: "/collection/rack-charcoal-trouser.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "High-Twist Wool & Washed Charcoal",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 620,
    imageHeight: 1100,
  },
  {
    id: 35,
    slug: "vintage-corduroy-overshirt",
    title: "Vintage Corduroy Overshirt",
    description:
      "Textured tobacco/terracotta corduroy button-up overshirt with dual chest pockets and natural horn buttons.",
    price: 210.0,
    stock: 15,
    thumbnail: "/collection/rack-corduroy-shirt.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Washed Cotton Corduroy · Tobacco",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 670,
    imageHeight: 960,
  },
  {
    id: 36,
    slug: "relaxed-carpenter-denim",
    title: "Relaxed Carpenter Denim",
    description:
      "Utility-informed wide leg denim featuring hammer loop detailing, reinforced rear knee patches, and subtle stone wash treatment.",
    price: 215.0,
    stock: 20,
    thumbnail: "/collection/ctrl-jeans.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Selvedge Organic Cotton",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 620,
    imageHeight: 1072,
  },
  {
    id: 37,
    slug: "oatmeal-cable-knit-sweater",
    title: "Oatmeal Cable-Knit Sweater",
    description:
      "Chunky cable-knit crewneck sweater crafted in warm oatmeal cream wool with clean rib trim cuffs and hem.",
    price: 185.0,
    stock: 24,
    thumbnail: "/collection/rack-cable-knit.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Chunky Spun Wool · Oatmeal",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 660,
    imageHeight: 960,
  },
  {
    id: 38,
    slug: "minimalist-wool-overcoat",
    title: "Minimalist Wool Overcoat",
    description:
      "Tailored long overcoat in camel wool blend with clean notched lapels, horn buttons, and deep welt pockets.",
    price: 340.0,
    stock: 12,
    thumbnail: "/collection/rack-wool-overcoat.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "80% Melton Wool, 20% Cashmere · Camel",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 530,
    imageHeight: 1060,
  },
  {
    id: 39,
    slug: "matte-leather-bomber",
    title: "Matte Leather Bomber Jacket",
    description:
      "Washed supple black leather aviator bomber jacket with silver zip hardware and heavyweight ribbed collar and cuffs.",
    price: 380.0,
    stock: 10,
    thumbnail: "/collection/rack-leather-bomber.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Genuine Full-Grain Leather · Matte Black",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 700,
    imageHeight: 1000,
  },
  {
    id: 40,
    slug: "forest-green-quarter-zip",
    title: "Forest Green Quarter-Zip",
    description:
      "Extra-fine merino wool ribbed knit pullover in deep forest green with silver metal zip collar.",
    price: 165.0,
    stock: 22,
    thumbnail: "/collection/rack-green-quarter-zip.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Merino Wool · Forest Sage",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 670,
    imageHeight: 980,
  },
  {
    id: 41,
    slug: "espresso-mohair-cardigan",
    title: "Espresso Mohair Cardigan",
    description:
      "Brushed textured mohair cardigan in rich espresso brown with relaxed drop-shoulder drape and horn button front.",
    price: 195.0,
    stock: 16,
    thumbnail: "/collection/rack-mohair-cardigan.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "Mohair & Alpaca Wool Blend · Espresso",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 680,
    imageHeight: 990,
  },
  {
    id: 42,
    slug: "heather-grey-boxy-hoodie",
    title: "Heather Grey Boxy Hoodie",
    description:
      "Custom 450gsm heavyweight melange fleece hoodie featuring an exaggerated wide body and clean double-lined hood.",
    price: 175.0,
    stock: 25,
    thumbnail: "/collection/rack-grey-hoodie.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "hoodies",
    fabric: "100% Organic Cotton Fleece · Heather Grey",
    sizes: ["S", "M", "L", "XL"],
    imageWidth: 710,
    imageHeight: 990,
  },
  {
    id: 43,
    slug: "light-wash-carpenter-denim",
    title: "Light Wash Carpenter Denim",
    description:
      "Vintage faded light blue 13.5oz denim with utility hammer loop, reinforced rear pockets, and relaxed straight leg.",
    price: 225.0,
    stock: 20,
    thumbnail: "/collection/rack-carpenter-denim.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Cotton 13.5oz Denim · Light Wash",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 630,
    imageHeight: 1080,
  },
  {
    id: 44,
    slug: "sand-khaki-relaxed-chino",
    title: "Sand Khaki Relaxed Chinos",
    description:
      "Tailored warm sand/beige relaxed straight-leg chinos in washed cotton twill with sharp front center creases.",
    price: 180.0,
    stock: 24,
    thumbnail: "/collection/rack-khaki-chino.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "100% Combed Cotton Twill · Sand Khaki",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 620,
    imageHeight: 1090,
  },
  {
    id: 45,
    slug: "washed-black-wide-denim",
    title: "Washed Black Wide Denim",
    description:
      "Washed charcoal black raw denim jeans with subtle vintage whiskering and generous pooling leg opening.",
    price: 210.0,
    stock: 18,
    thumbnail: "/collection/rack-black-denim.webp",
    category: "Clothes",
    audience: "men",
    department: "clothes",
    subcategory: "sweater",
    fabric: "14oz Selvedge Denim · Washed Black",
    sizes: ["30", "32", "34", "36"],
    imageWidth: 630,
    imageHeight: 1080,
  },
];

export interface CapsuleCategory {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  productIds: number[];
}

export const CAPSULE_CATEGORIES: CapsuleCategory[] = [
  {
    id: "core",
    name: "Core Edition",
    subtitle: "The signature 4-piece daily rotation engineered for effortless layering.",
    badge: "Autumn Capsule N° 01",
    productIds: [1, 2, 3, 4],
  },
  {
    id: "outerwear",
    name: "Outerwear",
    subtitle: "Structured field jackets, corduroy overshirts, and tailored wool coats.",
    badge: "Tailored & Outerwear",
    productIds: [5, 35, 38, 39],
  },
  {
    id: "knitwear",
    name: "Knitwear",
    subtitle: "Chunky cable-knits, merino quarter-zips, and brushed mohair cardigans.",
    badge: "Knitwear & Fleece",
    productIds: [37, 40, 41, 42],
  },
  {
    id: "denim",
    name: "Trousers",
    subtitle: "Pleated studio trousers, carpenter denim, and relaxed sand chinos.",
    badge: "Trousers & Denim",
    productIds: [34, 43, 44, 45],
  },
];

export function getCapsuleCategories(): CapsuleCategory[] {
  return CAPSULE_CATEGORIES;
}

export function getAllCapsuleProducts(): { capsule: CapsuleCategory; products: Product[] }[] {
  return CAPSULE_CATEGORIES.map((capsule) => ({
    capsule,
    products: capsule.productIds
      .map((id) => getProductById(id))
      .filter((p): p is Product => p !== undefined),
  }));
}

export function getCapsuleProducts(capsuleId: string): Product[] {
  const capsule = CAPSULE_CATEGORIES.find((c) => c.id === capsuleId) || CAPSULE_CATEGORIES[0];
  return capsule.productIds
    .map((id) => getProductById(id))
    .filter((p): p is Product => p !== undefined);
}

export function getProducts(): Product[] {
  return products;
}

export function getProductById(id: number): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug || String(p.id) === slug);
}

export function getCollectionPieces(): Product[] {
  return products.filter((p) => p.slug !== undefined).slice(0, 4);
}
