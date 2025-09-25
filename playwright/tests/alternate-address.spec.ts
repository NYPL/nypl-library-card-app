import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { TEST_ALTERNATE_ADDRESS } from "../utils/constants";

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
    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await alternateAddressPage.streetAddressInput.fill(
      TEST_ALTERNATE_ADDRESS.street
    );
    await alternateAddressPage.apartmentSuiteInput.fill(
      TEST_ALTERNATE_ADDRESS.apartmentSuite
    );
    await alternateAddressPage.cityInput.fill(TEST_ALTERNATE_ADDRESS.city);
    await alternateAddressPage.stateInput.fill(TEST_ALTERNATE_ADDRESS.state);
    await alternateAddressPage.postalCodeInput.fill(
      TEST_ALTERNATE_ADDRESS.postalCode
    );
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    await expect(addressVerificationPage.alternateAddressOption).toBeVisible();
  });
});
