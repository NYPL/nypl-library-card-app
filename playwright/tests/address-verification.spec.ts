import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";

test.describe("displays elements on Address Verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/address-verification?&newCard=true");
  });
  test("should display the correct headers", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.mainHeader).toBeVisible();
    await expect(addressVerificationPage.stepHeader).toBeVisible();
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
  });

  test("should display the next and previous buttons", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.previousButton).toBeVisible();
    await expect(addressVerificationPage.nextButton).toBeVisible();
  });
});

test.describe("enters home address and alternate address", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/location?&newCard=true");
  });
  test("enters valid addresses", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.addressHeading).toBeVisible();
    await addressPage.streetAddressInput.fill("123 Main St");
    await addressPage.cityInput.fill("New York");
    await addressPage.stateInput.fill("NY");
    await addressPage.postalCodeInput.fill("10001");
    await addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
    await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
    await alternateAddressPage.cityInput.fill("New York");
    await alternateAddressPage.stateInput.fill("NY");
    await alternateAddressPage.postalCodeInput.fill("10018");
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(addressVerificationPage.homeAddressOption).toBeVisible();
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    await expect(addressVerificationPage.alternateAddressOption).toBeVisible();
  });
});
