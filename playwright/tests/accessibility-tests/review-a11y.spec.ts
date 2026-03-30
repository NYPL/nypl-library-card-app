import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { ReviewPage } from "../../pageobjects/review.page";
import {
  fillPersonalInfo,
  fillAddress,
  fillAccountInfo,
} from "../../utils/form-helper";
import {
  PAGE_ROUTES,
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_PATRON,
  TEST_NYC_ADDRESS,
  IP,
} from "../../utils/constants";
test.describe("Review Page Accessibility Tests", () => {
  test.beforeEach(async ({ page, context }) => {
    await context.clearCookies();
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    const pageManager = new PageManager(page);
    await page.goto(PAGE_ROUTES.PERSONAL);

    await test.step("Personal info page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("Address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await pageManager.addressPage.nextButton.click();
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("Address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage.nextButton.click();
      await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible(
        { timeout: SPINNER_TIMEOUT }
      );
    });

    await test.step("Account page", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("Review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/review\?.*newCard=true/);
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({ page }) => {
    const reviewPage = new ReviewPage(page);

    const reviewLocators = [
      reviewPage.editPersonalInfoButton,
      reviewPage.lastNameInput,
      reviewPage.dateOfBirthInput,
      reviewPage.emailInput,
      reviewPage.alternateFormLink,
      reviewPage.locationsLink,
      reviewPage.receiveInfoCheckbox,
      reviewPage.editAddressButton,
      reviewPage.showPasswordCheckbox,
      reviewPage.editAccountButton,
      reviewPage.availableUsernameButton,
      reviewPage.passwordInput,
      reviewPage.verifyPasswordInput,
      reviewPage.showPasswordCheckbox,
      reviewPage.nyplLocationLink,
      reviewPage.selectHomeLibrary,
      reviewPage.cardholderTermsLink,
      reviewPage.rulesRegulationsLink,
      reviewPage.privacyPolicyLink,
      reviewPage.acceptTermsCheckbox,
      reviewPage.submitButton,
    ];
    await expect(reviewPage.stepHeading).toBeFocused();

    for (const locator of reviewLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();

      if (locator === reviewPage.editPersonalInfoButton) {
        await page.keyboard.press("Enter");
        await expect(reviewPage.firstNameInput).toBeVisible();
        await expect(reviewPage.firstNameInput).toBeFocused();
      } else if (locator === reviewPage.editAccountButton) {
        await page.keyboard.press("Enter");
        await expect(reviewPage.usernameInput).toBeVisible();
        await expect(reviewPage.usernameInput).toBeFocused();
      }
    }
  });
});
