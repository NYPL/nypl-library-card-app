import { AccountPage } from "../pageobjects/account.page";
import { PersonalPage } from "../pageobjects/personal.page";
import { ReviewPage } from "../pageobjects/review.page";
import { TEST_PATRON_INFO } from "./constants";
import { AddressFormPage, AddressData, AccountData } from "./types";

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
  await page.stateInput.click();
  await page.stateInput.selectOption(addressData.state);
  await page.postalCodeInput.fill(addressData.postalCode);
}

export async function fillAccountInfo(
  page: AccountPage | ReviewPage,
  accountData: AccountData
) {
  await page.usernameInput.fill(accountData.username);
  await page.passwordInput.fill(accountData.password);
  await page.verifyPasswordInput.fill(accountData.password);
  await page.selectHomeLibrary.click();
  await page.selectHomeLibrary.selectOption(accountData.homeLibraryCode);
  await page.acceptTermsLabel.check();
}
