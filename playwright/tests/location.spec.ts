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
