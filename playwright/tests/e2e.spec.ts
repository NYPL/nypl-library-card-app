import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
} from "../utils/form-helper";
import { TEST_PATRON_INFO } from "../utils/constants";

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
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(pageManager.alternateAddressPage);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("confirms address verification", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
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
      await expect(pageManager.reviewPage.firstNameInput).toHaveValue(
        TEST_PATRON_INFO.firstName
      );
      await expect(pageManager.reviewPage.lastNameInput).toHaveValue(
        TEST_PATRON_INFO.lastName
      );
      await expect(pageManager.reviewPage.dateOfBirthInput).toHaveValue(
        TEST_PATRON_INFO.dateOfBirth
      );
      await expect(pageManager.reviewPage.emailInput).toHaveValue(
        TEST_PATRON_INFO.email
      );
      await expect(pageManager.reviewPage.receiveInfoChoice).toHaveText("Yes");
    });
  });
});
