import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
} from "../utils/form-helper";
import { TEST_BARCODE_NUMBER, TEST_PATRON_INFO } from "../utils/constants";
import { mockCreatePatronApi } from "../utils/mock-api";

test.describe("E2E Flow: Complete Application Data Input to Reach Review Page", () => {
  test("displays patron information on review page", async ({ page }) => {
    const pageManager = new PageManager(page);

    // fill out and submit each form page to reach review page
    await test.step("enters personal information", async () => {
      await page.goto("/library-card/personal?newCard=true");
      await fillPersonalInfo(pageManager.personalPage);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.addressHeading).toBeVisible();
      await fillHomeAddress(pageManager.addressPage);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible({
        timeout: 10000,
      });
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
      await pageManager.accountPage.usernameInput.fill("User10225");
      await pageManager.accountPage.passwordInput.fill("Password123!");
      await pageManager.accountPage.verifyPasswordInput.fill("Password123!");
      await pageManager.accountPage.acceptTermsCheckbox.check();
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays Personal Information on review page", async () => {
      await expect(
        pageManager.reviewPage.getText(TEST_PATRON_INFO.firstName)
      ).toBeVisible({ timeout: 15000 });
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
      await pageManager.reviewPage.submitButton.click();

      // Wait for either the error or the congrats page
      const errorAppeared = await Promise.race([
        pageManager.reviewPage.formSubmissionUserNameError
          .waitFor({ state: "visible", timeout: 15000 })
          .then(() => true)
          .catch(() => false),
        pageManager.congratsPage.barcodeNumber
          .waitFor({ state: "visible", timeout: 15000 })
          .then(() => false)
          .catch(() => false),
      ]);

      if (errorAppeared) {
        const changeUserName =
          "qaTester" + Math.floor(Math.random() * 10000000);
        await pageManager.reviewPage.usernameInput.clear();
        await pageManager.reviewPage.usernameInput.fill(changeUserName);
        await pageManager.reviewPage.submitButton.click();
      }
    });

    await test.step("displays Congrats page", async () => {
      await expect(pageManager.congratsPage.barcodeNumber).toContainText(
        "255",
        { timeout: 15000 }
      );
    });
  });
});

test.describe("navigates from Review page to Congrats page", () => {
  test("mocks create patron API", async ({ page }) => {
    const pageManager = new PageManager(page);
    const fullName = `${TEST_PATRON_INFO.firstName} ${TEST_PATRON_INFO.lastName}`;

    await test.step("submits application", async () => {
      await mockCreatePatronApi(page, fullName, TEST_BARCODE_NUMBER);
      await page.goto("/library-card/review?newCard=true");

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
