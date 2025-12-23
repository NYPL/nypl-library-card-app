import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { fillAddress } from "../utils/form-helper";
import { TEST_ADDRESS_OPTIONS } from "../utils/constants";

test.describe("displays elements on Address verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/address-verification?newCard=true");
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
    await page.goto("/library-card/location?newCard=true");
  });

  test("enters valid addresses", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.addressHeading).toBeVisible();
    await fillAddress(addressPage, TEST_ADDRESS_OPTIONS);
    await addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await fillAddress(alternateAddressPage, TEST_ADDRESS_OPTIONS);
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(
      addressVerificationPage.getHomeAddressOption(TEST_ADDRESS_OPTIONS.street)
    ).toBeVisible();
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    await expect(
      addressVerificationPage.getAlternateAddressOption(
        TEST_ADDRESS_OPTIONS.street
      )
    ).toBeVisible();
  });

  test("prompts multiple addresses", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.addressHeading).toBeVisible();
    await fillAddress(addressPage, TEST_ADDRESS_OPTIONS);
    await addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await fillAddress(alternateAddressPage, TEST_ADDRESS_OPTIONS);
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(page.getByLabel("Home address")).toBeVisible();
    // await expect(addressVerificationPage.getHomeAddressOption(TEST_ADDRESS_OPTIONS.street)).toBeVisible();
    // await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    // await expect(addressVerificationPage.getAlternateAddressOption(TEST_ADDRESS_OPTIONS.street)).toBeVisible();
  });
});
