import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {} from // fillAccountInfo,
// fillAddress,
// fillPersonalInfo,
"../utils/form-helper";
import {
  PAGE_ROUTES,
  // SPINNER_TIMEOUT,
  SUPPORTED_LANGUAGES,
  // TEST_ACCOUNT,
  // TEST_EDITED_PATRON,
  // TEST_OOS_ADDRESS,
  // TEST_PATRON,
} from "../utils/constants";
import { getPatronID, deletePatron } from "../utils/sierra-api-utils";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`E2E: Edits patron information in ${name} (${lang})`, () => {
    let pageManager: PageManager;
    let appContent: any;
    const scrapedBarcode: string | null = null;

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

    test("edits personal info on review page", async ({ page }) => {
      pageManager = new PageManager(page, appContent);

      await test.step("begins at landing", async () => {
        await page.goto(PAGE_ROUTES.LANDING());
        await expect(pageManager.landingPage.applyHeading).toBeVisible();
        await pageManager.landingPage.getStartedButton.click();
      });

      // await test.step("enters personal information", async () => {
      //   await expect(pageManager.personalPage.stepHeading).toBeVisible();
      //   await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      //   await pageManager.personalPage.nextButton.click();
      // });

      // await test.step("enters home address", async () => {
      //   await expect(pageManager.addressPage.stepHeading).toBeVisible();
      //   await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      //   await pageManager.addressPage.nextButton.click();
      //   await expect(pageManager.addressPage.spinner).not.toBeVisible({
      //     timeout: SPINNER_TIMEOUT,
      //   });
      // });

      // await test.step("skips alternate address", async () => {
      //   await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      //   await pageManager.alternateAddressPage.nextButton.click();
      //   await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
      //     timeout: SPINNER_TIMEOUT,
      //   });
      // });

      // await test.step("confirms address verification", async () => {
      //   await expect(
      //     pageManager.addressVerificationPage.stepHeading
      //   ).toBeVisible();
      //   await pageManager.addressVerificationPage
      //     .getHomeAddressOption(TEST_OOS_ADDRESS.street)
      //     .check();
      //   await pageManager.addressVerificationPage.nextButton.click();
      //   await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible(
      //     {
      //       timeout: SPINNER_TIMEOUT,
      //     }
      //   );
      // });

      // await test.step("enters account information", async () => {
      //   await expect(pageManager.accountPage.stepHeading).toBeVisible();
      //   await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      //   await pageManager.accountPage.nextButton.click();
      // });

      // await test.step("edits personal info on review page", async () => {
      //   await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      //   await pageManager.reviewPage.editPersonalInfoButton.click();
      //   await fillPersonalInfo(pageManager.reviewPage, TEST_EDITED_PATRON);
      //   await pageManager.reviewPage.receiveInfoCheckbox.click();
      // });

      // await test.step("displays updated personal info on review page", async () => {
      //   await expect(pageManager.reviewPage.firstNameInput).toHaveValue(
      //     TEST_EDITED_PATRON.firstName
      //   );
      //   await expect(pageManager.reviewPage.lastNameInput).toHaveValue(
      //     TEST_EDITED_PATRON.lastName
      //   );
      //   await expect(pageManager.reviewPage.dateOfBirthInput).toHaveValue(
      //     TEST_EDITED_PATRON.dateOfBirth
      //   );
      //   await expect(pageManager.reviewPage.emailInput).toHaveValue(
      //     TEST_EDITED_PATRON.email
      //   );
      //   await expect(
      //     pageManager.reviewPage.receiveInfoCheckbox
      //   ).not.toBeChecked();
      // });

      // await test.step("submits application", async () => {
      //   await expect(pageManager.reviewPage.submitButton).toBeVisible();
      //   await pageManager.reviewPage.submitButton.click();
      // });

      // await test.step("displays edited name on congrats page", async () => {
      //   const editedFullName = `${TEST_EDITED_PATRON.firstName} ${TEST_EDITED_PATRON.lastName}`;
      //   await expect(pageManager.congratsPage.temporaryHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      //   await expect(pageManager.congratsPage.memberName).toHaveText(
      //     editedFullName
      //   );
      // });

      // await test.step("retrieves barcode from congrats page", async () => {
      //   scrapedBarcode =
      //     await pageManager.congratsPage.patronBarcodeNumber.textContent();
      //   expect(scrapedBarcode).not.toBeNull();
      // });
    });
  });
}
