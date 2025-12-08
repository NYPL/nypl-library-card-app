import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
  fillAccountInfo,
} from "../utils/form-helper";
import {
  TEST_ALTERNATE_ADDRESS,
  TEST_CUSTOMIZE_ACCOUNT,
  TEST_HOME_ADDRESS,
  TEST_PATRON_INFO,
} from "../utils/constants";

import { getPatronID, deletePatron } from "../utils/sierra-api-utils";

test.describe("E2E: Complete application with Sierra API integration", () => {
  let scrapedBarcode: string | null = null;

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

  test("displays patron information on congrats page", async ({ page }) => {
    const pageManager = new PageManager(page);

    await test.step("begins at landing", async () => {
      await page.goto("/library-card/new?newCard=true");
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillHomeAddress(pageManager.addressPage);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(pageManager.alternateAddressPage);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("selects home and alternate addresses", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await pageManager.addressVerificationPage.homeAddressOption.check();
      await pageManager.addressVerificationPage.alternateAddressOption.check();
      await pageManager.addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays personal information on review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.firstName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.lastName)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.dateOfBirth)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.email)
      ).toBeVisible();
      await expect(pageManager.reviewPage.receiveInfoChoice).toHaveText("Yes");
    });

    await test.step("displays home and alternate addresses on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.postalCode)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.city)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.state)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.postalCode)
      ).toBeVisible();
    });

    await test.step("displays account information on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.username)
      ).toBeVisible();
      await expect(pageManager.reviewPage.showPasswordCheckbox).toBeVisible();
      await pageManager.reviewPage.showPasswordCheckbox.check();
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.password)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.defaultLibrary)
      ).toBeVisible();
    });

    await test.step("submits application", async () => {
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("retrieves barcode from congrats page", async () => {
      await expect(pageManager.congratsPage.stepHeading).toBeVisible();
      await expect(pageManager.congratsPage.displayBarcodeNumber).toBeVisible();
      await expect(pageManager.congratsPage.displayBarcodeNumber).toContainText(
        pageManager.congratsPage.EXPECTED_BARCODE_PREFIX
      );
      scrapedBarcode =
        await pageManager.congratsPage.displayBarcodeNumber.textContent();
      expect(scrapedBarcode).not.toBeNull();
    });
  });
});
