import { test, expect } from "@playwright/test";
import { PageManager } from "../../pageobjects/page-manager.page";
import {
  // fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../../utils/form-helper";
import {
  // EXPECTED_BARCODE_PREFIX,
  PAGE_ROUTES,
  // PATRON_TYPES,
  SPINNER_TIMEOUT,
  SUPPORTED_LANGUAGES,
  // TEST_ACCOUNT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../../utils/constants";
import {
  deletePatron,
  getPatronID,
  // verifyPatronData,
} from "../../utils/sierra-api-utils";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`E2E: Complete OOS patron application with Sierra API integration in ${name} (${lang})`, () => {
    let pageManager: PageManager;
    let appContent: any;
    const scrapedBarcode: string | null = null;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../../public/locales/${lang}/common.json`);
      pageManager = new PageManager(page, appContent);
    });

    test.afterAll("deletes patron", async () => {
      if (scrapedBarcode) {
        try {
          const patronID = await getPatronID(scrapedBarcode);

          if (patronID) {
            await deletePatron(patronID);
          }
        } catch (error) {
          console.error("Error during patron deletion:", error);
        }
      }
    });

    test("submits OOS patron application", async ({ page }) => {
      // const fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;

      await test.step("begins at landing", async () => {
        await page.goto(PAGE_ROUTES.LANDING(lang));
        await expect(pageManager.landingPage.applyHeading).toBeVisible();
        await pageManager.landingPage.getStartedButton.click();
      });

      await test.step("enters personal information", async () => {
        await expect(pageManager.personalPage.stepHeading).toBeVisible();
        await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
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
      });

      await test.step("verifies home and alternate addresses", async () => {
        await expect(
          pageManager.addressVerificationPage.stepHeading
        ).toBeVisible();
        await pageManager.addressVerificationPage
          .getHomeAddressOption(TEST_OOS_ADDRESS.street)
          .click();
        await pageManager.addressVerificationPage
          .getAlternateAddressOption(TEST_NYC_ADDRESS.street)
          .click();
        await pageManager.addressVerificationPage.nextButton.click();
        await expect(
          pageManager.addressVerificationPage.spinner
        ).not.toBeVisible({ timeout: SPINNER_TIMEOUT });
      });

      // await test.step("enters account information", async () => {
      //   await expect(pageManager.accountPage.stepHeading).toBeVisible();
      //   await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      //   await pageManager.accountPage.nextButton.click();
      // });

      // await test.step("displays personal information on review page", async () => {
      //   await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_PATRON.firstName)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_PATRON.lastName)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_PATRON.dateOfBirth)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_PATRON.email)
      //   ).toBeVisible();
      //   await expect(pageManager.reviewPage.receiveInfoChoice).toHaveText("Yes");
      // });

      // await test.step("displays home and alternate addresses on review page", async () => {
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_OOS_ADDRESS.street)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_OOS_ADDRESS.city)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_OOS_ADDRESS.state)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_OOS_ADDRESS.postalCode)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_NYC_ADDRESS.street)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_NYC_ADDRESS.city)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_NYC_ADDRESS.state)
      //   ).toBeVisible();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_NYC_ADDRESS.postalCode)
      //   ).toBeVisible();
      // });

      // await test.step("displays account information on review page", async () => {
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_ACCOUNT.username)
      //   ).toBeVisible();
      //   await expect(pageManager.reviewPage.showPasswordCheckboxLabel).toBeVisible();
      //   await pageManager.reviewPage.showPasswordCheckboxLabel.click();
      //   await expect(
      //     pageManager.reviewPage.getText(TEST_ACCOUNT.password)
      //   ).toBeVisible();
      // });

      // await test.step("submits application", async () => {
      //   await expect(pageManager.reviewPage.submitButton).toBeVisible();
      //   await pageManager.reviewPage.submitButton.click();
      // });

      // await test.step("displays temporary card elements on congrats page", async () => {
      //   await expect(pageManager.congratsPage.mainHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.temporaryHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.temporaryCardBanner).toBeVisible();
      //   await expect(pageManager.congratsPage.learnMoreLink).toBeVisible();
      //   await expect(pageManager.congratsPage.getHelpEmailLink).toBeVisible();
      // });

      // await test.step("displays generated library card on congrats page", async () => {
      //   await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      //   await expect(pageManager.congratsPage.issuedDateHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.issuedDate).toBeVisible();
      //   await expect(pageManager.congratsPage.patronBarcodeNumber).toBeVisible();
      //   await expect(pageManager.congratsPage.patronBarcodeNumber).toContainText(
      //     EXPECTED_BARCODE_PREFIX
      //   );
      // });

      // await test.step("verifies patron data in Sierra database", async () => {
      //   scrapedBarcode =
      //     await pageManager.congratsPage.patronBarcodeNumber.textContent();
      //   expect(scrapedBarcode).not.toBeNull();
      //   await verifyPatronData(
      //     scrapedBarcode,
      //     TEST_PATRON,
      //     TEST_OOS_ADDRESS,
      //     PATRON_TYPES.DIGITAL_TEMPORARY
      //   );
      // });
    });
  });
}
