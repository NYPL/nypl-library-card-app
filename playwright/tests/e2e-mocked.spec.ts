import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { TEST_BARCODE_NUMBER, TEST_PATRON_INFO } from "../utils/constants";
import { mockCreatePatronApi } from "../utils/mock-api";
import {
  fillAccountInfo,
  fillAlternateAddress,
  fillHomeAddress,
  fillPersonalInfo,
} from "../utils/form-helper";

test.describe("E2E Flow: Complete application using mocked submit", () => {
  test("displays patron information on congrats page", async ({ page }) => {
    const pageManager = new PageManager(page);
    const fullName = `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`;

    await test.step("begins at landing", async () => {
      await page.goto("/library-card/new?newCard=true");
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage);
      await expect(pageManager.personalPage.checkBox).toBeChecked();
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

    await test.step("confirms address verification", async () => {
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

    await test.step("displays review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    });

    await test.step("submits application", async () => {
      await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER);
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays variable elements on Congrats page", async () => {
      await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      await expect(pageManager.congratsPage.barcodeNumber).toHaveText(
        TEST_BARCODE_NUMBER
      );
    });
  });
});
