import { test, expect } from "@playwright/test";
import { LocationPage } from "../pageobjects/location.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/location?newCard=true");
});

test("displays all headings", async ({ page }) => {
  const locationPage = new LocationPage(page);
  await expect(locationPage.mainHeading).toBeVisible();
  await expect(locationPage.stepHeading).toBeVisible();
  await expect(locationPage.addressHeading).toBeVisible();
});

test("displays address form", async ({ page }) => {
  const locationPage = new LocationPage(page);
  await expect(locationPage.streetAddressInput).toBeVisible();
  await expect(locationPage.apartmentSuiteInput).toBeVisible();
  await expect(locationPage.cityInput).toBeVisible();
  await expect(locationPage.stateInput).toBeVisible();
  await expect(locationPage.postalCodeInput).toBeVisible();
});

test("displays next and previous buttons", async ({ page }) => {
  const locationPage = new LocationPage(page);
  await expect(locationPage.nextButton).toBeVisible();
  await expect(locationPage.previousButton).toBeVisible();
});

test("displays errors for required fields", async ({ page }) => {
  const locationPage = new LocationPage(page);
  await locationPage.streetAddressInput.fill("");
  await locationPage.apartmentSuiteInput.fill("");
  await locationPage.cityInput.fill("");
  await locationPage.stateInput.fill("");
  await locationPage.postalCodeInput.fill("");
  await locationPage.nextButton.click();
  await expect(locationPage.streetAddressError).toBeVisible();
  await expect(locationPage.cityError).toBeVisible();
  await expect(locationPage.stateError).toBeVisible();
  await expect(locationPage.postalCodeError).toBeVisible();
});
