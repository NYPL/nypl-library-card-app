import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { fillHomeAddress, fillAlternateAddress } from "../utils/form-helper";
import AxeBuilder from "@axe-core/playwright";

test.describe("displays elements on Address verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/address-verification?&newCard=true");
  });

  test("should have no accessibility violations", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toEqual([]);
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
    await fillHomeAddress(addressPage);
    await addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await fillAlternateAddress(alternateAddressPage);
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(addressVerificationPage.homeAddressOption).toBeVisible();
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    await expect(addressVerificationPage.alternateAddressOption).toBeVisible();
  });
});
