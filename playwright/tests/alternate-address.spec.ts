import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { fillAddress } from "../utils/form-helper";
import { SUPPORTED_LANGUAGES, TEST_NYC_ADDRESS } from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`alternate address page in ${name} (${lang})`, () => {
    let alternateAddressPage: AlternateAddressPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      alternateAddressPage = new AlternateAddressPage(page, appContent);
      await page.goto(`/library-card/workAddress?newCard=true&lang=${lang}`);
    });

    test.describe("displays elements", () => {
      test("displays headings and buttons", async () => {
        await expect(alternateAddressPage.mainHeading).toBeVisible();
        await expect(alternateAddressPage.stepHeading).toBeVisible();
        await expect(alternateAddressPage.addressHeading).toBeVisible();
        await expect(alternateAddressPage.nextButton).toBeVisible();
        await expect(alternateAddressPage.previousButton).toBeVisible();
      });

      test("displays alternate address form", async () => {
        await expect(alternateAddressPage.streetAddressInput).toBeVisible();
        await expect(alternateAddressPage.apartmentSuiteInput).toBeVisible();
        await expect(alternateAddressPage.cityInput).toBeVisible();
        await expect(alternateAddressPage.stateInput).toBeVisible();
        await expect(alternateAddressPage.postalCodeInput).toBeVisible();
      });
    });

    test.describe("enters alternate address", () => {
      test("enters valid alternate address", async () => {
        await fillAddress(alternateAddressPage, TEST_NYC_ADDRESS);
        await expect(alternateAddressPage.streetAddressInput).toHaveValue(
          TEST_NYC_ADDRESS.street
        );
        await expect(alternateAddressPage.apartmentSuiteInput).toHaveValue(
          TEST_NYC_ADDRESS.apartmentSuite
        );
        await expect(alternateAddressPage.cityInput).toHaveValue(
          TEST_NYC_ADDRESS.city
        );
        await expect(alternateAddressPage.stateInput).toHaveValue(
          TEST_NYC_ADDRESS.state
        );
        await expect(alternateAddressPage.postalCodeInput).toHaveValue(
          TEST_NYC_ADDRESS.postalCode
        );
      });
    });
  });
}
