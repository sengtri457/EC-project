import { Customer } from "@/types";

export type ValidationErrors = Partial<Record<keyof Customer | "cardNumber" | "cardExpiry" | "cardCvc", string>>;

export interface CheckoutFormState extends Customer {
  cardNumber?: string;
  cardExpiry?: string;
  cardCvc?: string;
}

export function validateCustomer(data: CheckoutFormState): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  // 1. Recipient Full Name
  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Please enter the recipient full name.";
  }

  // 2. Cambodian Phone Validation
  const cleanPhone = (data.phone || "").replace(/[\s\-()]/g, "");
  // Cambodian phones typically start with 0 (8-10 digits) or +855 (9-11 digits)
  const isCambodianPhone = /^(0\d{8,9}|\+855\d{8,9}|\d{8,10})$/.test(cleanPhone);
  if (!cleanPhone) {
    errors.phone = "Phone number is required for courier delivery.";
  } else if (!isCambodianPhone) {
    errors.phone = "Enter a valid phone number (e.g., 012 345 678 or +855 12 345 678).";
  }

  // 3. Email (optional or valid format if provided)
  if (data.email && data.email.trim().length > 0) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email.trim())) {
      errors.email = "Please enter a valid email address.";
    }
  }

  // 4. City / Province
  if (!data.cityProvince || data.cityProvince.trim().length < 2) {
    errors.cityProvince = "Please select or enter your City / Province.";
  }

  // 5. Street / House Address
  if (!data.streetAddress || data.streetAddress.trim().length < 3) {
    errors.streetAddress = "Please enter your street number and house address.";
  }

  // 6. Khan / District (if in Phnom Penh)
  if (data.cityProvince === "Phnom Penh" && (!data.khanDistrict || data.khanDistrict.trim().length < 2)) {
    errors.khanDistrict = "Please select your Khan / District in Phnom Penh.";
  }

  // 7. Card validation if selected
  if (data.paymentMethod === "card") {
    const rawCard = (data.cardNumber || "").replace(/\s/g, "");
    if (!rawCard || rawCard.length < 13 || rawCard.length > 19) {
      errors.cardNumber = "Enter a valid card number (16 digits).";
    }

    if (!data.cardExpiry || !/^\d{2}\/\d{2}$/.test(data.cardExpiry.trim())) {
      errors.cardExpiry = "Expiry format must be MM/YY.";
    }

    if (!data.cardCvc || data.cardCvc.trim().length < 3) {
      errors.cardCvc = "CVC must be 3 or 4 digits.";
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
