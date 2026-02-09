import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  //   fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  SUPPORTED_LANGUAGES,
  // TEST_BARCODE_NUMBER,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  // TEST_PATRON_INFO,
} from "../utils/constants";
// import { mockCreatePatronApi } from "../utils/mock-api";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`E2E: Complete application using mocked submit in ${name} (${lang})`, () => {
    let pageManager: PageManager;
    let appContent: any;

    test("displays patron information on congrats page", async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      pageManager = new PageManager(page, appContent);
      // const fullName = `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`;

      await test.step("begins at landing", async () => {
        await page.goto(`/library-card/new?newCard=true&lang=${lang}`);
        await expect(pageManager.landingPage.applyHeading).toBeVisible();
        await pageManager.landingPage.getStartedButton.click();
      });

      await test.step("enters personal information", async () => {
        await expect(pageManager.personalPage.stepHeading).toBeVisible();
        await fillPersonalInfo(pageManager.personalPage);
      });

      await test.step("unchecks receive info checkbox", async () => {
        await pageManager.personalPage.receiveInfoCheckbox.click();
        await expect(
          pageManager.personalPage.receiveInfoCheckbox
        ).not.toBeChecked();
        await pageManager.personalPage.nextButton.click();
      });

      await test.step("enters home address", async () => {
        await expect(pageManager.addressPage.stepHeading).toBeVisible();
        await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
        await pageManager.addressPage.nextButton.click();
        await expect(pageManager.addressPage.spinner).not.toBeVisible({
          timeout: SPINNER_TIMEOUT,
        });
      });

      await test.step("enters alternate address", async () => {
        await expect(
          pageManager.alternateAddressPage.stepHeading
        ).toBeVisible();
        await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
        await pageManager.alternateAddressPage.nextButton.click();
        await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
          timeout: SPINNER_TIMEOUT,
        });

        // await test.step("confirms address verification", async () => {
        //   await expect(
        //     pageManager.addressVerificationPage.stepHeading
        //   ).toBeVisible();
        //   await pageManager.addressVerificationPage
        //     .getHomeAddressOption(TEST_OOS_ADDRESS.street)
        //     .check();
        //   await pageManager.addressVerificationPage
        //     .getAlternateAddressOption(TEST_NYC_ADDRESS.street)
        //     .check();
        //   await pageManager.addressVerificationPage.nextButton.click();
        // });

        // await test.step("enters account information", async () => {
        //   await expect(pageManager.accountPage.stepHeading).toBeVisible();
        //   await fillAccountInfo(pageManager.accountPage);
        //   await pageManager.accountPage.nextButton.click();
        // });

        // await test.step("displays review page", async () => {
        //   await expect(pageManager.reviewPage.stepHeading).toBeVisible();
        // });

        // await test.step("verifies receive info checkbox is unchecked on review page", async () => {
        // await pageManager.reviewPage.editPersonalInfoButton.click();
        // await expect(
        // pageManager.reviewPage.receiveInfoCheckbox
        // ).not.toBeChecked();
        // });

        // await test.step("submits application", async () => {
        //   await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER);
        //   await expect(pageManager.reviewPage.submitButton).toBeVisible();
        //   await pageManager.reviewPage.submitButton.click();
        // });

        // await test.step("displays variable elements on Congrats page", async () => {
        //   await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
        //   await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
        //   await expect(pageManager.congratsPage.issuedDateHeading).toBeVisible();
        //   await expect(pageManager.congratsPage.issuedDate).toBeVisible();
        //   await expect(pageManager.congratsPage.patronBarcodeNumber).toHaveText(
        //     TEST_BARCODE_NUMBER
        //   );
        // });
      });
    });
  });
}
