import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { LandingPage } from "../pageobjects/landing.page";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/workAddress?newCard=true");
});

test.describe("displays elements on Alternate Address page", () => {
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
});

test.describe("enters alternate address", () => {
  test("enters valid alternate address", async ({ page }) => {
    await page.goto("/library-card/workAddress?newCard=true");
    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
    await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
    await alternateAddressPage.cityInput.fill("New York");
    await alternateAddressPage.stateInput.fill("NY");
    await alternateAddressPage.postalCodeInput.fill("10018");
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
  });
});
