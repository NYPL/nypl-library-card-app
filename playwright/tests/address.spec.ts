import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/location?newCard=true");
});

test("displays all headings", async ({ page }) => {
  const addressPage = new AddressPage(page);
  await expect(addressPage.mainHeading).toBeVisible();
  await expect(addressPage.stepHeading).toBeVisible();
  await expect(addressPage.addressHeading).toBeVisible();
});

test("displays address form", async ({ page }) => {
  const addressPage = new AddressPage(page);
  await expect(addressPage.streetAddressInput).toBeVisible();
  await expect(addressPage.apartmentSuiteInput).toBeVisible();
  await expect(addressPage.cityInput).toBeVisible();
  await expect(addressPage.stateInput).toBeVisible();
  await expect(addressPage.postalCodeInput).toBeVisible();
});

test("displays next and previous buttons", async ({ page }) => {
  const addressPage = new AddressPage(page);
  await expect(addressPage.nextButton).toBeVisible();
  await expect(addressPage.previousButton).toBeVisible();
});

test("displays errors for required fields", async ({ page }) => {
  const addressPage = new AddressPage(page);
  await addressPage.streetAddressInput.fill("");
  await addressPage.apartmentSuiteInput.fill("");
  await addressPage.cityInput.fill("");
  await addressPage.stateInput.fill("");
  await addressPage.postalCodeInput.fill("");
  await addressPage.nextButton.click();
  await expect(addressPage.streetAddressError).toBeVisible();
  await expect(addressPage.cityError).toBeVisible();
  await expect(addressPage.stateError).toBeVisible();
  await expect(addressPage.postalCodeError).toBeVisible();
});

test("displays errors for invalid fields", async ({ page }) => {
  const addressPage = new AddressPage(page);
  await addressPage.stateInput.fill("ABC");
  await addressPage.postalCodeInput.fill("1234");
  await addressPage.nextButton.click();
  await expect(addressPage.stateError).toBeVisible();
  await expect(addressPage.postalCodeError).toBeVisible();
});
