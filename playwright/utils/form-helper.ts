import { AccountPage } from "../pageobjects/account.page";
import { PersonalPage } from "../pageobjects/personal.page";
import { ReviewPage } from "../pageobjects/review.page";
import { TEST_PATRON_INFO, TEST_CUSTOMIZE_ACCOUNT } from "./constants";
import { AddressFormPage, AddressData } from "./types";

export async function fillPersonalInfo(page: PersonalPage | ReviewPage) {
  await page.firstNameInput.fill(TEST_PATRON_INFO.firstName);
  await page.lastNameInput.fill(TEST_PATRON_INFO.lastName);
  await page.dateOfBirthInput.fill(TEST_PATRON_INFO.dateOfBirth);
  await page.emailInput.fill(TEST_PATRON_INFO.email);
}

export async function fillAddress(
  page: AddressFormPage,
  addressData: AddressData
) {
  await page.streetAddressInput.fill(addressData.street);
  await page.apartmentSuiteInput.fill(addressData.apartmentSuite);
  await page.cityInput.fill(addressData.city);
  await page.stateInput.fill(addressData.state);
  await page.postalCodeInput.fill(addressData.postalCode);
}

export async function fillAccountInfo(page: AccountPage | ReviewPage) {
  await page.usernameInput.fill(TEST_CUSTOMIZE_ACCOUNT.username);
  await page.passwordInput.fill(TEST_CUSTOMIZE_ACCOUNT.password);
  await page.verifyPasswordInput.fill(TEST_CUSTOMIZE_ACCOUNT.password);
  await page.selectHomeLibrary.selectOption(TEST_CUSTOMIZE_ACCOUNT.homeLibrary);
  await page.acceptTermsCheckbox.check();
}
