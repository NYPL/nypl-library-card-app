import { expect, Locator, Response } from "@playwright/test";
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
  let apiListener: Promise<Response> | undefined;

  if (currentPage instanceof ReviewPage) {
    apiListener = currentPage.page.waitForResponse(
      (response) =>
        response.request().method() === "POST" &&
        response.url().includes("/library-card/api/create-patron"),
      { timeout: SPINNER_TIMEOUT }
    );
  } // add else if for address API

  await nextButton.click();

  const errorMessages = getErrorMessages(currentPage);
  const nextPageLoaded = await waitForErrorOrHeading(
    errorMessages,
    nextPageHeading,
    apiListener
  );

  if (!nextPageLoaded) {
    for (const errorMessage of errorMessages) {
      // replace with throw new Error?
      await expect(errorMessage).not.toBeVisible();
    }
  }
}

/* 
waits for either error messages or next page's heading to display
returns true if the next page heading displays or false if error messages display
*/
export async function waitForErrorOrHeading(
  errorMessages: Locator[],
  nextPageHeading: Locator,
  apiListener?: Promise<Response>
): Promise<boolean> {
  const apiStatus: Promise<never> =
    apiListener !== undefined
      ? apiListener.then((response) => {
          if (!response.ok()) {
            throw new Error(
              `Create patron API failed with status ${response.status()}: ${response.statusText()} before next page rendered.`
            );
          }
          return new Promise<never>(() => {});
        })
      : new Promise<never>(() => {});

  return Promise.race([
    ...errorMessages.map((locator) =>
      locator
        .waitFor({ state: "visible", timeout: 1500 })
        .then(() => false)
        .catch(() => new Promise<never>(() => {}))
    ),
    nextPageHeading
      .waitFor({ state: "visible", timeout: SPINNER_TIMEOUT })
      .then(() => true),
    apiStatus,
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
