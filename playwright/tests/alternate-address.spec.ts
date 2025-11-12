import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { TEST_ALTERNATE_ADDRESS } from "../utils/constants";
import { fillAlternateAddress } from "../utils/form-helper";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/workAddress?newCard=true");
});

test.describe("displays elements on Alternate address page", () => {
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
    await fillAlternateAddress(alternateAddressPage);
    await expect(alternateAddressPage.streetAddressInput).toHaveValue(
      TEST_ALTERNATE_ADDRESS.street
    );
    await expect(alternateAddressPage.apartmentSuiteInput).toHaveValue(
      TEST_ALTERNATE_ADDRESS.apartmentSuite
    );
    await expect(alternateAddressPage.cityInput).toHaveValue(
      TEST_ALTERNATE_ADDRESS.city
    );
    await expect(alternateAddressPage.stateInput).toHaveValue(
      TEST_ALTERNATE_ADDRESS.state
    );
    await expect(alternateAddressPage.postalCodeInput).toHaveValue(
      TEST_ALTERNATE_ADDRESS.postalCode
    );
  });
});
