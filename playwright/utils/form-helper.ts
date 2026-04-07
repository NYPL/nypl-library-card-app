import { expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AccountPage } from "../pageobjects/account.page";
import { ReviewPage } from "../pageobjects/review.page";
import { AddressFormPage, AddressData, AccountData, PatronData } from "./types";

export async function fillPersonalInfo(
  page: PersonalPage | ReviewPage,
  patronData: PatronData
) {
  await page.firstNameInput.fill(patronData.firstName);
  await page.lastNameInput.fill(patronData.lastName);
  await page.dateOfBirthInput.fill(patronData.dateOfBirth);
  await page.emailInput.fill(patronData.email);
}

export async function fillAddress(
  page: AddressFormPage,
  addressData: AddressData
) {
  await page.streetAddressInput.fill(addressData.street);
  await page.apartmentSuiteInput.fill(addressData.apartmentSuite);
  await page.cityInput.fill(addressData.city);
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
  if (!(await page.acceptTermsCheckbox.isChecked())) {
    await page.acceptTermsCheckboxLabel.click();
  }
}

export async function expectNoErrors(
  page:
    | PersonalPage
    | AddressPage
    | AlternateAddressPage
    | AccountPage
    | ReviewPage
) {
  if (page instanceof PersonalPage) {
    await expect(page.firstNameError).not.toBeVisible();
    await expect(page.lastNameError).not.toBeVisible();
    await expect(page.dateOfBirthInvalid).not.toBeVisible();
    await expect(page.dateOfBirthError).not.toBeVisible();
    await expect(page.emailError).not.toBeVisible();
  } else if (page instanceof AddressPage) {
    await expect(page.streetAddressError).not.toBeVisible();
    await expect(page.cityError).not.toBeVisible();
    await expect(page.stateError).not.toBeVisible();
    await expect(page.postalCodeError).not.toBeVisible();
  } else if (page instanceof AlternateAddressPage) {
    await expect(page.streetAddressError).not.toBeVisible();
    await expect(page.cityError).not.toBeVisible();
    await expect(page.stateError).not.toBeVisible();
    await expect(page.postalCodeError).not.toBeVisible();
  } else if (page instanceof AccountPage) {
    await expect(page.usernameError).not.toBeVisible();
    await expect(page.passwordError).not.toBeVisible();
    await expect(page.verifyPasswordError).not.toBeVisible();
    await expect(page.homeLibraryError).not.toBeVisible();
    await expect(page.acceptTermsError).not.toBeVisible();
  } else if (page instanceof ReviewPage) {
    await expect(page.firstNameError).not.toBeVisible();
    await expect(page.lastNameError).not.toBeVisible();
    await expect(page.dateOfBirthInvalid).not.toBeVisible();
    await expect(page.dateOfBirthError).not.toBeVisible();
    await expect(page.emailError).not.toBeVisible();
    await expect(page.streetAddressError).not.toBeVisible();
    await expect(page.cityError).not.toBeVisible();
    await expect(page.stateError).not.toBeVisible();
    await expect(page.postalCodeError).not.toBeVisible();
    await expect(page.usernameError).not.toBeVisible();
    await expect(page.passwordError).not.toBeVisible();
    await expect(page.verifyPasswordError).not.toBeVisible();
    await expect(page.homeLibraryError).not.toBeVisible();
    await expect(page.acceptTermsError).not.toBeVisible();
  }
}
