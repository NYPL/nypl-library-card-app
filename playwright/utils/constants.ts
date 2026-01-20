import { AddressData } from "./types";
import errorMessages from "../../public/locales/en/common.json";

const uniqueSuffix = Date.now().toString().slice(-6);
const TEST_UNIQUE_USERNAME = `qauser${uniqueSuffix}`;

export const TEST_PATRON_INFO = {
  firstName: "Jane",
  lastName: "Doe",
  email: "test@gmail.com",
  dateOfBirth: "12/25/1984",
};

export const TEST_HOME_ADDRESS: AddressData = {
  street: "123 Main St",
  apartmentSuite: "Apartment 201",
  city: "Stamford",
  state: "CT",
  postalCode: "06902",
};
export const TEST_CUSTOMIZE_ACCOUNT = {
  username: TEST_UNIQUE_USERNAME,
  password: "Test@1234",
  homeLibrary: "eb", // used to confirm dropdown selection
  defaultLibrary: "E-Branch", // used to confirm text displays on page
};
export const TEST_ALTERNATE_ADDRESS: AddressData = {
  street: "476 5th Ave",
  apartmentSuite: "Room 200",
  city: "New York",
  state: "NY",
  postalCode: "10018",
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

export const ERROR_MESSAGES = {
  FIRST_NAME_INVALID: errorMessages.personal.errorMessage.firstName,
  LAST_NAME_INVALID: errorMessages.personal.errorMessage.lastName,
  DATE_OF_BIRTH_INVALID: errorMessages.personal.errorMessage.birthdate,
  EMAIL_INVALID: errorMessages.personal.errorMessage.email,
  STREET_ADDRESS_INVALID:
    "There was a problem. Please enter a valid street address.",
  CITY_INVALID: "There was a problem. Please enter a valid city.",
  STATE_INVALID:
    "There was a problem. Please enter a 2-character state abbreviation.",
  POSTAL_CODE_INVALID:
    "There was a problem. Please enter a 5 or 9-digit postal code.",
  USERNAME_INVALID:
    "There was a problem. Username must be between 5-25 alphanumeric characters.",
  USERNAME_UNAVAILABLE: "This username is unavailable. Please try another.",
  USERNAME_AVAILABLE: "This username is available.",
  PASSWORD_INVALID:
    "There was a problem. Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)",
  VERIFY_PASSWORD_INVALID:
    "There was a problem. The two passwords don't match.",
  ACCEPT_TERMS_ERROR:
    "There was a problem. The Terms and Conditions must be checked.",
};

export const TEST_BARCODE_NUMBER = "12341234123412";
