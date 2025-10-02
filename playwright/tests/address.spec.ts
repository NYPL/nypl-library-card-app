import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { TEST_HOME_ADDRESS } from "../utils/constants";
import { fillHomeAddress } from "../utils/form-helper";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/location?newCard=true");
});

test.describe("displays elements on Address page", () => {
  test("displays headings", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.mainHeading).toBeVisible();
    await expect(addressPage.stepHeading).toBeVisible();
    await expect(addressPage.addressHeading).toBeVisible();
  });

  test("displays home address form", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.streetAddressInput).toBeVisible();
    await expect(addressPage.apartmentSuiteInput).toBeVisible();
    await expect(addressPage.cityInput).toBeVisible();
    await expect(addressPage.stateInput).toBeVisible();
    await expect(addressPage.postalCodeInput).toBeVisible();
  });

  test("displays next and previous buttons", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.nextButton).toBeVisible();
    await expect(addressPage.previousButton).toBeVisible();
  });
});

test.describe("displays errors for invalid fields", () => {
  test("displays errors for required fields", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await addressPage.streetAddressInput.fill("");
    await addressPage.cityInput.fill("");
    await addressPage.stateInput.fill("");
    await addressPage.postalCodeInput.fill("");
    await addressPage.nextButton.click();
    await expect(addressPage.streetAddressError).toBeVisible();
    await expect(addressPage.cityError).toBeVisible();
    await expect(addressPage.stateError).toBeVisible();
    await expect(addressPage.postalCodeError).toBeVisible();
  });

  test("enter too many characters", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await addressPage.stateInput.fill("ABC");
    await addressPage.postalCodeInput.fill("123456");
    await addressPage.nextButton.click();
    await expect(addressPage.stateError).toBeVisible();
    await expect(addressPage.postalCodeError).toBeVisible();
  });

  test("enter too few characters", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await addressPage.stateInput.fill("A");
    await addressPage.postalCodeInput.fill("1234");
    await addressPage.nextButton.click();
    await expect(addressPage.stateError).toBeVisible();
    await expect(addressPage.postalCodeError).toBeVisible();
  });
});

test.describe("enters home address", () => {
  test("enters valid home address", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await fillHomeAddress(addressPage);
    await expect(addressPage.streetAddressInput).toHaveValue(
      TEST_HOME_ADDRESS.street
    );
    await expect(addressPage.apartmentSuiteInput).toHaveValue(
      TEST_HOME_ADDRESS.apartmentSuite
    );
    await expect(addressPage.cityInput).toHaveValue(TEST_HOME_ADDRESS.city);
    await expect(addressPage.stateInput).toHaveValue(TEST_HOME_ADDRESS.state);
    await expect(addressPage.postalCodeInput).toHaveValue(
      TEST_HOME_ADDRESS.postalCode
    );
  });
});
