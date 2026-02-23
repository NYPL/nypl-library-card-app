import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  //   fillAccountInfo,
  //   fillAddress,
  fillPersonalInfo,
} from "../utils/form-helper";
import {
  PAGE_ROUTES,
  SUPPORTED_LANGUAGES,
  // TEST_ACCOUNT,
  // TEST_BARCODE_NUMBER,
  // TEST_NYC_ADDRESS,
  // TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../utils/constants";
// import { mockCreatePatronApi } from "../utils/mock-api";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`E2E: Complete application using mocked submit in ${name} (${lang})`, () => {
    let pageManager: PageManager;
    let appContent: any;

    test("displays patron information on congrats page", async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      pageManager = new PageManager(page, appContent);
      // const fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;

      await test.step("begins at landing", async () => {
        await page.goto(PAGE_ROUTES.LANDING(lang));
        await expect(pageManager.landingPage.applyHeading).toBeVisible();
        await pageManager.landingPage.getStartedButton.click();
      });

      await test.step("enters personal information", async () => {
        await expect(pageManager.personalPage.stepHeading).toBeVisible();
        await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      });

      await test.step("unchecks receive info checkbox", async () => {
        await pageManager.personalPage.receiveInfoCheckbox.click();
        await expect(
          pageManager.personalPage.receiveInfoCheckbox
        ).not.toBeChecked();
        await pageManager.personalPage.nextButton.click();
      });

      // await test.step("enters home address", async () => {
      //   await expect(pageManager.addressPage.stepHeading).toBeVisible();
      //   await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      //   await pageManager.addressPage.nextButton.click();
      // });

      // await test.step("enters alternate address", async () => {
      //   await expect(
      //     pageManager.alternateAddressPage.stepHeading
      //   ).toBeVisible();
      //   await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
      //   await pageManager.alternateAddressPage.nextButton.click();
      // });

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
      //   await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
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

      // await test.step("displays temporary card banner", async () => {
      //   await expect(pageManager.congratsPage.temporaryHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.temporaryCardBanner).toBeVisible();
      //   await expect(pageManager.congratsPage.learnMoreLink).toBeVisible();
      //   await expect(pageManager.congratsPage.getHelpEmailLink).toBeVisible();
      // });
    });
  });
}
