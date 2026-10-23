import { Customer } from "@/types";

export type ValidationErrors = Partial<Record<keyof Customer, string>>;

export function validateCustomer(data: Customer): { isValid: boolean; errors: ValidationErrors } {
  const errors: ValidationErrors = {};

  if (!data.name || data.name.trim().length < 2) {
    errors.name = "Full name is required (at least 2 characters).";
  }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailPattern.test(data.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  const cleanPhone = data.phone.trim();
  const phonePattern = /^\d{8,15}$/;
  if (!cleanPhone || !phonePattern.test(cleanPhone)) {
    errors.phone = "Phone must contain only numbers (8 to 15 digits).";
  }

  if (!data.address || data.address.trim().length < 5) {
    errors.address = "Shipping address is required (at least 5 characters).";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
