import { Locator } from "@playwright/test";

export interface AddressFormPage {
  streetAddressInput: Locator;
  apartmentSuiteInput: Locator;
  cityInput: Locator;
  stateInput: Locator;
  postalCodeInput: Locator;
}

export interface AddressData {
  street: string;
  apartmentSuite: string;
  city: string;
  state: string;
  postalCode: string;
}

export interface AccountData {
  username: string;
  password: string;
  homeLibrary: string;
  homeLibraryCode: string;
}
