import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/workAddress?newCard=true");
});

test("displays all headings", async ({ page }) => {
  const alternateAddressPage = new AlternateAddressPage(page);
  await expect(alternateAddressPage.mainHeading).toBeVisible();
  await expect(alternateAddressPage.stepHeading).toBeVisible();
  await expect(alternateAddressPage.addressHeading).toBeVisible();
});

test("displays alternate address form", async ({ page }) => {
  const alternateAddressPage = new AlternateAddressPage(page);
  await expect(alternateAddressPage.streetAddressInput).toBeVisible();
  await expect(alternateAddressPage.apartmentSuiteInput).toBeVisible();
  await expect(alternateAddressPage.cityInput).toBeVisible();
  await expect(alternateAddressPage.stateInput).toBeVisible();
  await expect(alternateAddressPage.postalCodeInput).toBeVisible();
});

test("displays next and previous buttons", async ({ page }) => {
  const alternateAddressPage = new AlternateAddressPage(page);
  await expect(alternateAddressPage.nextButton).toBeVisible();
  await expect(alternateAddressPage.previousButton).toBeVisible();
});

test.describe("displays errors for invalid fields", () => {
  test("enter too many characters", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await alternateAddressPage.stateInput.fill("ABC");
    await alternateAddressPage.postalCodeInput.fill("123456");
    await alternateAddressPage.nextButton.click();
    await expect(alternateAddressPage.stateError).toBeVisible();
    await expect(alternateAddressPage.postalCodeError).toBeVisible();
  });

  test("enter too few characters", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await alternateAddressPage.stateInput.fill("A");
    await alternateAddressPage.postalCodeInput.fill("1234");
    await alternateAddressPage.nextButton.click();
    await expect(alternateAddressPage.stateError).toBeVisible();
    await expect(alternateAddressPage.postalCodeError).toBeVisible();
  });
});
