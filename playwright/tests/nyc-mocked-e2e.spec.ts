import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  PAGE_ROUTES,
  PATRON_TYPES,
  TEST_ACCOUNT,
  TEST_BARCODE_NUMBER,
  TEST_NYC_ADDRESS,
  TEST_PATRON,
} from "../utils/constants";
import { mockCreatePatronApi, mockCreateAddress } from "../utils/mock-api";
import {
  fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../utils/form-helper";

test.describe("E2E Flow: Complete application using mocked address and submit", () => {
  test("displays patron information on congrats page", async ({ page }) => {
    const pageManager = new PageManager(page);
    const fullName = `${TEST_PATRON.firstName} ${TEST_PATRON.lastName}`;

    await test.step("begins at landing", async () => {
      await page.goto(PAGE_ROUTES.LANDING);
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
      await pageManager.landingPage.getStartedButton.click();
    });

    await test.step("enters personal information", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters mocked home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await mockCreateAddress(page, TEST_NYC_ADDRESS);
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expect(pageManager.addressPage.spinner).not.toBeVisible();
    });

    await test.step("skips alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await pageManager.alternateAddressPage.nextButton.click();
      await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible();
    });

    await test.step("confirms address verification", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_NYC_ADDRESS.street)
        .check();
      await pageManager.addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    });

    await test.step("submits application", async () => {
      await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER, 8);
      await expect(pageManager.reviewPage.submitButton).toBeVisible();
      await pageManager.reviewPage.submitButton.click();
    });

    await test.step("displays heading and link on congrats page", async () => {
      await expect(pageManager.congratsPage.stepHeading).toBeVisible();
      await expect(pageManager.congratsPage.readOrListenOnGo).toBeVisible();
    });
    await test.step("displays variable elements on congrats page", async () => {
      await expect(pageManager.congratsPage.memberNameHeading).toBeVisible();
      await expect(pageManager.congratsPage.memberName).toHaveText(fullName);
      await expect(pageManager.congratsPage.issuedDateHeading).toBeVisible();
      await expect(pageManager.congratsPage.issuedDate).toBeVisible();
      await expect(pageManager.congratsPage.patronBarcodeNumber).toHaveText(
        TEST_BARCODE_NUMBER
      );
    });

    await test.step("verifies patron type", async () => {
      expect(PATRON_TYPES.DIGITAL_METRO).toBe(9);
    });
  });
});
