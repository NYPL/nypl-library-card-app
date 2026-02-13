import { AddressData } from "./types";
import appContent from "../../public/locales/en/common.json";

// personal information
export const TEST_PATRON_INFO = {
  firstName: "Jane",
  lastName: "Doe",
  email: "test@gmail.com",
  dateOfBirth: "12/25/1984",
};

// address
export const TEST_NYC_ADDRESS: AddressData = {
  street: "476 5th Ave",
  apartmentSuite: "Room 200",
  city: "New York",
  state: "NY",
  postalCode: "10018",
};

export const TEST_NYS_ADDRESS: AddressData = {
  street: "500 S Meadow St",
  apartmentSuite: "Suite 1",
  city: "Ithaca",
  state: "NY",
  postalCode: "14850",
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
const uniqueSuffix = Date.now().toString().slice(-6);
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

export const ERROR_MESSAGES = {
  // probs remove this at the end
  STREET_ADDRESS_INVALID: appContent.location.errorMessage.line1,
  CITY_INVALID: appContent.location.errorMessage.city,
  STATE_INVALID: appContent.location.errorMessage.state,
  POSTAL_CODE_INVALID: appContent.location.errorMessage.zip,
  USERNAME_INVALID: appContent.account.errorMessage.username,
  USERNAME_UNAVAILABLE: "This username is unavailable. Please try another.",
  USERNAME_AVAILABLE: "This username is available.",
  PASSWORD_INVALID: appContent.account.errorMessage.password,
  VERIFY_PASSWORD_INVALID: appContent.account.errorMessage.verifyPassword,
  HOME_LIBRARY_ERROR: appContent.account.errorMessage.homeLibraryCode,
  ACCEPT_TERMS_ERROR: appContent.account.errorMessage.acceptTerms,
};

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
