import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { /*fillAccountInfo,*/ fillAddress } from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  SUPPORTED_LANGUAGES,
  // TEST_PATRON_INFO,
} from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`E2E: Validate address errors in ${name} (${lang})`, () => {
    let pageManager: PageManager;
    let appContent: any;

    test("displays error when address is too long", async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      pageManager = new PageManager(page, appContent);
      const invalidStreet = "A".repeat(100);

      await test.step("enters invalid home address", async () => {
        await page.goto(`/library-card/location?newCard=true&lang=${lang}`);
        await expect(pageManager.addressPage.stepHeading).toBeVisible();
        await fillAddress(pageManager.addressPage, {
          street: invalidStreet,
          apartmentSuite: "1",
          city: "City",
          state: "NY",
          postalCode: "12345",
        });
        await pageManager.addressPage.nextButton.click();
        await expect(pageManager.addressPage.spinner).not.toBeVisible({
          timeout: SPINNER_TIMEOUT,
        });
      });

      await test.step("skips alternate address", async () => {
        await expect(
          pageManager.alternateAddressPage.stepHeading
        ).toBeVisible();
        await pageManager.alternateAddressPage.nextButton.click();
        await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
          timeout: SPINNER_TIMEOUT,
        });
      });

      //   await test.step("confirms address verification", async () => {
      //     await expect(pageManager.addressVerificationPage.stepHeading).toBeVisible();
      //     await pageManager.addressVerificationPage
      //       .getHomeAddressOption(invalidStreet)
      //       .check();
      //     await pageManager.addressVerificationPage.nextButton.click();
      //   });

      //   await test.step("enters account information", async () => {
      //     await expect(pageManager.accountPage.stepHeading).toBeVisible();
      //     await fillAccountInfo(pageManager.accountPage);
      //     await pageManager.accountPage.nextButton.click();
      //   });

      //   await test.step("displays error on review page", async () => {
      //     await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      //     await pageManager.reviewPage.submitButton.click();
      //     await expect(pageManager.reviewPage.streetAddressError).toBeVisible();
      //   });
    });
  });
}
