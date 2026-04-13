import { expect, type Page } from "@playwright/test";
import { AddressData, AccountData, PatronData } from "./types";
import { PageManager } from "../pageobjects/page-manager.page";
import { fillAddress, fillPersonalInfo, fillAccountInfo } from "./form-helper";
import {
  PAGE_ROUTES,
  PROGRESS_BAR_TIMEOUT,
  SPINNER_TIMEOUT,
} from "./constants";

const ADDRESS_ROUTE_PATTERN = /\/location\?.*newCard=true/;
const ALTERNATE_ADDRESS_ROUTE_PATTERN = /\/alternate-address\?.*newCard=true/;
const ADDRESS_VERIFICATION_ROUTE_PATTERN =
  /\/address-verification\?.*newCard=true/;

type NavigateToAddressVerificationOptions = {
  page: Page;
  pageManager: PageManager;
  patronData: PatronData;
  addressData: AddressData;
  alternateAddressData?: AddressData;
};

type NavigateToCongratsOptions = {
  page: Page;
  pageManager: PageManager;
  patronData: PatronData;
  addressData: AddressData;
  accountData: AccountData;
  alternateAddressData?: AddressData;
};

export async function navigateToAddressVerificationPage({
  page,
  pageManager,
  patronData,
  addressData,
  alternateAddressData,
}: NavigateToAddressVerificationOptions) {
  await page.goto(PAGE_ROUTES.PERSONAL);

  await expect(pageManager.personalPage.stepHeading).toBeVisible();
  await fillPersonalInfo(pageManager.personalPage, patronData);

  await expect(pageManager.personalPage.firstNameInput).toHaveValue(
    patronData.firstName
  );
  await expect(pageManager.personalPage.lastNameInput).toHaveValue(
    patronData.lastName
  );
  await expect(pageManager.personalPage.dateOfBirthInput).toHaveValue(
    patronData.dateOfBirth
  );
  await expect(pageManager.personalPage.emailInput).toHaveValue(
    patronData.email
  );

  await expect(pageManager.personalPage.nextButton).toBeEnabled();
  await pageManager.personalPage.nextButton.click();
  await expect(page).toHaveURL(ADDRESS_ROUTE_PATTERN, {
    timeout: SPINNER_TIMEOUT,
  });

  //address page
  await expect(pageManager.addressPage.stepHeading).toBeVisible();
  await fillAddress(pageManager.addressPage, addressData);
  await expect(pageManager.addressPage.streetAddressInput).toHaveValue(
    addressData.street
  );
  await expect(pageManager.addressPage.cityInput).toHaveValue(addressData.city);
  await expect(pageManager.addressPage.stateInput).toHaveValue(
    addressData.state
  );
  await expect(pageManager.addressPage.postalCodeInput).toHaveValue(
    addressData.postalCode
  );
  await expect(pageManager.addressPage.spinner).not.toBeVisible({
    timeout: SPINNER_TIMEOUT,
  });
  await expect(pageManager.addressPage.nextButton).toBeEnabled();

  if (alternateAddressData) {
    await pageManager.addressPage.nextButton.click();
    await expect(page).toHaveURL(ALTERNATE_ADDRESS_ROUTE_PATTERN, {
      timeout: SPINNER_TIMEOUT,
    });

    await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
    await fillAddress(pageManager.alternateAddressPage, alternateAddressData);
    await expect(
      pageManager.alternateAddressPage.streetAddressInput
    ).toHaveValue(alternateAddressData.street);
    await expect(pageManager.alternateAddressPage.cityInput).toHaveValue(
      alternateAddressData.city
    );
    await expect(pageManager.alternateAddressPage.stateInput).toHaveValue(
      alternateAddressData.state
    );
    await expect(pageManager.alternateAddressPage.postalCodeInput).toHaveValue(
      alternateAddressData.postalCode
    );
    await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
    await expect(pageManager.alternateAddressPage.nextButton).toBeEnabled();

    await pageManager.alternateAddressPage.nextButton.click();
    await expect(page).toHaveURL(ADDRESS_VERIFICATION_ROUTE_PATTERN, {
      timeout: SPINNER_TIMEOUT,
    });

    //address verification page
    await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
  } else {
    await pageManager.addressPage.nextButton.click();
    await expect(page).toHaveURL(ADDRESS_VERIFICATION_ROUTE_PATTERN, {
      timeout: SPINNER_TIMEOUT,
    });
    await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible({
      timeout: SPINNER_TIMEOUT,
    });
  }

  await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
}

export async function navigateToCongratsPage({
  page,
  pageManager,
  patronData,
  addressData,
  accountData,
  alternateAddressData,
}: NavigateToCongratsOptions) {
  await navigateToAddressVerificationPage({
    page,
    pageManager,
    patronData,
    addressData,
    alternateAddressData,
  });

  await expect(pageManager.addressVerificationPage.nextButton).toBeEnabled();
  await pageManager.addressVerificationPage.nextButton.click();
  await expect(pageManager.accountPage.stepHeading).toBeVisible();

  await fillAccountInfo(pageManager.accountPage, accountData);
  await expect(pageManager.accountPage.nextButton).toBeEnabled();
  await pageManager.accountPage.nextButton.click();
  await expect(pageManager.reviewPage.stepHeading).toBeVisible();

  await expect(pageManager.reviewPage.submitButton).toBeEnabled();
  await pageManager.reviewPage.submitButton.click();
  await expect(pageManager.reviewPage.progressBar).toBeVisible();
  await expect(pageManager.reviewPage.progressBar).not.toBeVisible({
    timeout: PROGRESS_BAR_TIMEOUT,
  });

  await expect(pageManager.congratsPage.metroOrNonMetroHeading).toBeVisible();
}
