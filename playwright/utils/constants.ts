import { AddressData, PatronData } from "./types";
import appContent from "../../public/locales/en/common.json";

// personal information
export const TEST_PATRON: PatronData = {
  firstName: "Jane",
  lastName: "Doe",
  email: "test@gmail.com",
  dateOfBirth: "12/25/1984",
};

export const TEST_EDITED_PATRON: PatronData = {
  firstName: "Tom",
  lastName: "Nook",
  email: "edited@gmail.com",
  dateOfBirth: "01/01/1990",
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
  FIRST_NAME_INVALID: appContent.personal.errorMessage.firstName,
  LAST_NAME_INVALID: appContent.personal.errorMessage.lastName,
  DATE_OF_BIRTH_INVALID: appContent.personal.errorMessage.birthdate,
  AGE_ERROR: appContent.personal.errorMessage.ageGate,
  EMAIL_INVALID: appContent.personal.errorMessage.email,
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

export const PAGE_ROUTES = {
  LANDING: "/library-card/new?newCard=true",
  PERSONAL: "/library-card/personal?newCard=true",
  ADDRESS: "/library-card/location?newCard=true",
  ALTERNATE_ADDRESS: "/library-card/alternate-address?newCard=true",
  ADDRESS_VERIFICATION: "/library-card/address-verification?newCard=true",
  ACCOUNT: "/library-card/account?newCard=true",
  REVIEW: "/library-card/review?newCard=true",
  CONGRATS: "/library-card/congrats?newCard=true",
};

export const PATRON_TYPES = {
  PATRON_TYPE_7: 7,
  PATRON_TYPE_8: 8,
  PATRON_TYPE_9: 9,
};
