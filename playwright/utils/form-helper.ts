import { expect, Locator } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { AccountPage } from "../pageobjects/account.page";
import { ReviewPage } from "../pageobjects/review.page";
import { AddressFormPage, AddressData, AccountData, PatronData } from "./types";
import { SPINNER_TIMEOUT } from "./constants";

export async function fillPersonalInfo(
  page: PersonalPage | ReviewPage,
  patronData: PatronData
) {
  await page.firstNameInput.fill(patronData.firstName);
  await page.lastNameInput.fill(patronData.lastName);
  await page.dateOfBirthInput.fill(patronData.dateOfBirth);
  await page.emailInput.fill(patronData.email);
  if (!patronData.ecommunicationsPref) {
    await page.receiveInfoCheckboxLabel.click();
  }
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

export async function clickNextButton(
  currentPage:
    | PersonalPage
    | AddressPage
    | AlternateAddressPage
    | AddressVerificationPage
    | AccountPage
    | ReviewPage,
  nextButton: Locator,
  nextPageHeading: Locator
): Promise<void> {
  await nextButton.click();

  const errorMessages = getErrorMessages(currentPage);

  const nextPageLoaded = await displaysNextPage(errorMessages, nextPageHeading);

  if (!nextPageLoaded) {
    for (const errorMessage of errorMessages) {
      await expect(errorMessage).toBeVisible();
    }
  }
}

// clicking the next button triggers either error messages or the next page to load, this function waits for either of those to happen
// waits for either error messages or next page's heading to display, returns true if the next page heading displays or false if error messages display
export async function displaysNextPage( // rename to displaysNextPage or waitForErrorOrHeading
  errorMessages: Locator[],
  nextPageHeading: Locator,
  timeout: number = SPINNER_TIMEOUT
): Promise<boolean> {
  return Promise.race([
    ...errorMessages.map((locator) =>
      locator
        .waitFor({ state: "visible", timeout: 1500 })
        .then(() => false)
        .catch(() => new Promise<never>(() => {}))
    ),
    nextPageHeading
      .waitFor({ state: "visible", timeout: timeout })
      .then(() => true),
  ]);
}

export function getErrorMessages(
  page:
    | PersonalPage
    | AddressPage
    | AlternateAddressPage
    | AddressVerificationPage
    | AccountPage
    | ReviewPage
): Locator[] {
  if (page instanceof PersonalPage) {
    return [
      page.firstNameError,
      page.lastNameError,
      page.dateOfBirthInvalid,
      page.dateOfBirthError,
      page.emailError,
    ];
  } else if (page instanceof AddressPage) {
    return [
      page.streetAddressError,
      page.cityError,
      page.stateError,
      page.postalCodeError,
    ];
  } else if (page instanceof AlternateAddressPage) {
    return [
      page.streetAddressError,
      page.cityError,
      page.stateError,
      page.postalCodeError,
    ];
  } else if (page instanceof AddressVerificationPage) {
    return [];
  } else if (page instanceof AccountPage) {
    return [
      page.usernameError,
      page.passwordError,
      page.verifyPasswordError,
      page.homeLibraryError,
      page.acceptTermsError,
    ];
  } else if (page instanceof ReviewPage) {
    return [
      page.firstNameError,
      page.lastNameError,
      page.dateOfBirthInvalid,
      page.dateOfBirthError,
      page.emailError,
      page.streetAddressError,
      page.cityError,
      page.stateError,
      page.postalCodeError,
      page.usernameError,
      page.unavailableUsernameMessage,
      page.passwordError,
      page.verifyPasswordError,
      page.homeLibraryError,
      page.acceptTermsError,
    ];
  }
  return [];
}
