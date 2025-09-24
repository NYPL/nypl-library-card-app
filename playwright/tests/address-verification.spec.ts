import { test, expect } from "@playwright/test";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/address-verification?&newCard=true");
});

test.describe("displays elements on Address Verification page", () => {
  test("should display the correct headers", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.mainHeader).toBeVisible();
    await expect(addressVerificationPage.stepHeader).toBeVisible();
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
  });

  test("should display the next and previous buttons", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.previousButton).toBeVisible();
    await expect(addressVerificationPage.nextButton).toBeVisible();
  });
});
