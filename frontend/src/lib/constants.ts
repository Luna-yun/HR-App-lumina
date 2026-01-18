// ASEAN Member Countries - Official List
export const ASEAN_COUNTRIES = [
  { code: "BN", name: "Brunei" },
  { code: "KH", name: "Cambodia" },
  { code: "ID", name: "Indonesia" },
  { code: "LA", name: "Laos" },
  { code: "MY", name: "Malaysia" },
  { code: "MM", name: "Myanmar" },
  { code: "PH", name: "Philippines" },
  { code: "SG", name: "Singapore" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "VN", name: "Vietnam" },
] as const;

export type ASEANCountryCode = typeof ASEAN_COUNTRIES[number]["code"];
export type ASEANCountryName = typeof ASEAN_COUNTRIES[number]["name"];

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  EMPLOYEE: "employee",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];
