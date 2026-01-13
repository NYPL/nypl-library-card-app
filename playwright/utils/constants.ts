import { AddressData } from "./types";

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
  EMAIL_INVALID: "There was a problem. Please enter a valid email address.",
  USERNAME_UNAVAILABLE: "This username is unavailable. Please try another.",
  USERNAME_AVAILABLE: "This username is available.",
};

export const TEST_BARCODE_NUMBER = "12341234123412";
