import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import {
  TEST_PATRON_INFO,
  TEST_HOME_ADDRESS,
  TEST_ALTERNATE_ADDRESS,
} from "./constants";
import { AddressFormPage, AddressData } from "./types";

export async function fillPersonalInfo(page: PersonalPage) {
  await page.firstNameInput.fill(TEST_PATRON_INFO.firstName);
  await page.lastNameInput.fill(TEST_PATRON_INFO.lastName);
  await page.emailInput.fill(TEST_PATRON_INFO.email);
  await page.dateOfBirthInput.fill(TEST_PATRON_INFO.dateOfBirth);
  await page.checkBox.check();
}

async function fillAddress(page: AddressFormPage, addressData: AddressData) {
  await page.streetAddressInput.fill(addressData.street);
  await page.apartmentSuiteInput.fill(addressData.apartmentSuite);
  await page.cityInput.fill(addressData.city);
  await page.stateInput.fill(addressData.state);
  await page.postalCodeInput.fill(addressData.postalCode);
}

export async function fillHomeAddress(page: AddressPage) {
  await fillAddress(page, TEST_HOME_ADDRESS);
}

export async function fillAlternateAddress(page: AlternateAddressPage) {
  await fillAddress(page, TEST_ALTERNATE_ADDRESS);
}
