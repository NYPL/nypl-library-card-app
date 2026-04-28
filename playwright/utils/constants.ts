import { AddressData, PatronData } from "./types";

// personal information
export const TEST_PATRON: PatronData = {
  firstName: "Jane",
  lastName: "Doe",
  email: "test@gmail.com",
  dateOfBirth: "12/25/1984",
  ecommunicationsPref: true,
};

export const TEST_EDITED_PATRON: PatronData = {
  firstName: "Tom",
  lastName: "Nook",
  email: "edited@gmail.com",
  dateOfBirth: "01/01/1990",
  ecommunicationsPref: false,
};

// address
export const TEST_NYC_ADDRESS: AddressData = {
  street: "246 E 90th St",
  apartmentSuite: "APT 4D",
  city: "New York",
  state: "NY",
  postalCode: "10128",
};

export const TEST_NYS_ADDRESS: AddressData = {
  street: "167 Lovering Ave",
  apartmentSuite: "",
  city: "Buffalo",
  state: "NY",
  postalCode: "14216",
};

export const TEST_OOS_ADDRESS: AddressData = {
  street: "123 Main St",
  apartmentSuite: "Apartment 201",
  city: "Stamford",
  state: "CT",
  postalCode: "06902",
};

export const TEST_MULTIMATCH_ADDRESS: AddressData = {
  street: "123 34th Street",
  apartmentSuite: "Suite 100",
  city: "New York",
  state: "NY",
  postalCode: "10000",
};

export const TEST_MULTIMATCH_ADDRESS_EAST: AddressData = {
  street: "123 E 34th St STE 100",
  apartmentSuite: "",
  city: "New York",
  state: "NY",
  postalCode: "10016-4601",
};

export const TEST_MULTIMATCH_ADDRESS_WEST: AddressData = {
  street: "123 W 34th St STE 100",
  apartmentSuite: "",
  city: "New York",
  state: "NY",
  postalCode: "10001-2101",
};

// Common timeouts
export const SPINNER_TIMEOUT = 10000;

// account
const uniqueSuffix = Date.now().toString().slice(-10);
const TEST_UNIQUE_USERNAME = `qauser${uniqueSuffix}`;

export const TEST_ACCOUNT = {
  username: TEST_UNIQUE_USERNAME,
  password: "Test@1234",
  homeLibrary: "Virtual", // used to confirm text on review page
  homeLibraryCode: "vr", // used to confirm dropdown selection
};

export const TEST_EDITED_ACCOUNT = {
  username: "EditedUsername",
  password: "Edited@1234",
  homeLibrary: "Andrew Heiskell Braille and Talking Book Library", // used to confirm text on review page
  homeLibraryCode: "lb", // used to confirm dropdown selection
};

// congrats
export const TEST_BARCODE_NUMBER = "12341234123412";
export const EXPECTED_BARCODE_PREFIX = "255";

export const SUPPORTED_LANGUAGES = [
  { lang: "en", name: "English" },
  // { lang: "ar", name: "Arabic" },
  // { lang: "bn", name: "Bengali" },
  { lang: "es", name: "Spanish" },
  // { lang: "fr", name: "French" },
  // { lang: "ht", name: "Haitian Creole" },
  // { lang: "ko", name: "Korean" },
  // { lang: "pl", name: "Polish" },
  // { lang: "ru", name: "Russian" },
  // { lang: "ur", name: "Urdu" },
  // { lang: "zhcn", name: "Chinese" },
];

const withLang = (path: string, lang?: string) =>
  `${path}?newCard=true${lang ? `&lang=${encodeURIComponent(lang)}` : ""}`;

export const PAGE_ROUTES = {
  LANDING: (lang?: string) => withLang("/library-card/new", lang),
  PERSONAL: (lang?: string) => withLang("/library-card/personal", lang),
  ADDRESS: (lang?: string) => withLang("/library-card/location", lang),
  ALTERNATE_ADDRESS: (lang?: string) =>
    withLang("/library-card/alternate-address", lang),
  ADDRESS_VERIFICATION: (lang?: string) =>
    withLang("/library-card/address-verification", lang),
  ACCOUNT: (lang?: string) => withLang("/library-card/account", lang),
  REVIEW: (lang?: string) => withLang("/library-card/review", lang),
  CONGRATS: (lang?: string) => withLang("/library-card/congrats", lang),
};

export const PATRON_TYPES = {
  DIGITAL_TEMPORARY: 7,
  DIGITAL_NON_METRO: 8,
  DIGITAL_METRO: 9,
} as const;

export type PType = (typeof PATRON_TYPES)[keyof typeof PATRON_TYPES];

export const IP = {
  NYC_IP: "65.209.66.130",
  NYS_IP: "172.100.3.84",
};
