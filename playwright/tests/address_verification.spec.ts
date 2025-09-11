import { test, expect } from "@playwright/test";
import { AddressVerificationPage } from "../pageobjects/address_verification.page";

test.beforeEach(async ({ page }) => {
  await page.goto("library-card/address-verification?&newCard=true");
});

test("should display the correct headers", async ({ page }) => {
  const addressVerificationPage = new AddressVerificationPage(page);
  await expect(addressVerificationPage.mainHeader).toBeVisible();
  await expect(addressVerificationPage.subHeader).toBeVisible();
  await expect(addressVerificationPage.homeAddressHeader).toBeVisible();

});

test("should allow user to verify address", async ({ page }) => {
  const addressVerificationPage = new AddressVerificationPage(page);
  //    await expect(addressVerificationPage.addressDisplayed).toBeVisible();
  // await expect(addressVerificationPage.verifyRadioButton).toBeVisible();
  await expect(addressVerificationPage.previousButton).toBeVisible();
  await expect(addressVerificationPage.nextButton).toBeVisible();
});
