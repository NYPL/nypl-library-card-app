import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { SUPPORTED_LANGUAGES, TEST_OOS_ADDRESS } from "../utils/constants";
import { fillAddress } from "../utils/form-helper";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`home address page in ${name} (${lang})`, () => {
    let addressPage: AddressPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      addressPage = new AddressPage(page, appContent);
      await page.goto(`/library-card/location?newCard=true&lang=${lang}`);
    });

    test.describe("displays elements", () => {
      test("displays headings and buttons", async () => {
        await expect(addressPage.mainHeading).toBeVisible();
        await expect(addressPage.stepHeading).toBeVisible();
        await expect(addressPage.addressHeading).toBeVisible();
        await expect(addressPage.nextButton).toBeVisible();
        await expect(addressPage.previousButton).toBeVisible();
      });

      test("displays home address form", async () => {
        await expect(addressPage.streetAddressInput).toBeVisible();
        await expect(addressPage.apartmentSuiteInput).toBeVisible();
        await expect(addressPage.cityInput).toBeVisible();
        await expect(addressPage.stateInput).toBeVisible();
        await expect(addressPage.postalCodeInput).toBeVisible();
      });
    });

    test.describe("enters home address", () => {
      test("enters valid home address", async () => {
        await fillAddress(addressPage, TEST_OOS_ADDRESS);
        await expect(addressPage.streetAddressInput).toHaveValue(
          TEST_OOS_ADDRESS.street
        );
        await expect(addressPage.apartmentSuiteInput).toHaveValue(
          TEST_OOS_ADDRESS.apartmentSuite
        );
        await expect(addressPage.cityInput).toHaveValue(TEST_OOS_ADDRESS.city);
        await expect(addressPage.stateInput).toHaveValue(
          TEST_OOS_ADDRESS.state
        );
        await expect(addressPage.postalCodeInput).toHaveValue(
          TEST_OOS_ADDRESS.postalCode
        );
      });
    });

    test.describe("displays error messages", () => {
      test("displays errors for required fields", async () => {
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

      test("enter too many characters", async () => {
        await addressPage.stateInput.fill("ABC");
        await addressPage.postalCodeInput.fill("123456");
        await addressPage.nextButton.click();
        await expect(addressPage.stateError).toBeVisible();
        await expect(addressPage.postalCodeError).toBeVisible();
      });

      test("enter too few characters", async () => {
        await addressPage.stateInput.fill("A");
        await addressPage.postalCodeInput.fill("1234");
        await addressPage.nextButton.click();
        await expect(addressPage.stateError).toBeVisible();
        await expect(addressPage.postalCodeError).toBeVisible();
      });

      test("enter postal code with dash", async () => {
        await addressPage.postalCodeInput.fill("12345-6789");
        await addressPage.nextButton.click();
        await expect(addressPage.postalCodeError).toBeVisible();
      });
    });
  });
}
