export const CAMBODIA_PROVINCES = [
  "Phnom Penh",
  "Kandal",
  "Siem Reap",
  "Battambang",
  "Preah Sihanouk (Kompong Som)",
  "Kampot",
  "Kampong Cham",
  "Kampong Chhnang",
  "Kampong Speu",
  "Kampong Thom",
  "Kep",
  "Koh Kong",
  "Kratie",
  "Mondulkiri",
  "Oddar Meanchey",
  "Pailin",
  "Preah Vihear",
  "Prey Veng",
  "Pursat",
  "Ratanakiri",
  "Stung Treng",
  "Svay Rieng",
  "Takeo",
  "Tboung Khmum",
];

export const PHNOM_PENH_KHANS = [
  "Boeng Keng Kang (BKK)",
  "Chamkarmon",
  "Daun Penh",
  "Tuol Kouk",
  "7 Makara",
  "Sen Sok",
  "Chbar Ampov",
  "Meanchey",
  "Russei Keo",
  "Pur Senchey",
  "Chroy Changvar",
  "Dangkao",
  "Prek Pnov",
  "Kamboul",
];

export const KHR_RATE = 4100; // Standard 1 USD = 4,100 KHR

export function toKhr(usd: number): string {
  const khr = Math.round(usd * KHR_RATE);
  return khr.toLocaleString("en-US") + " ៛";
}
