import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { ReviewPage } from "../../pageobjects/review.page";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
import { fillAccountInfo } from "../../utils/form-helper";
import { navigateToAddressVerificationPage } from "../../utils/a11y-helper";
import {
  TEST_ACCOUNT,
  TEST_PATRON,
  TEST_NYC_ADDRESS,
  IP,
} from "../../utils/constants";

test.describe("Review Page Accessibility Tests", () => {
  let pageManager: PageManager;

  test.beforeEach(async ({ page, context }) => {
    pageManager = new PageManager(page);

    await context.clearCookies();
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    // Sequence to reach the Review Page
    await test.step("Setup: Navigate to Review Page", async () => {
      await navigateToAddressVerificationPage({
        page,
        pageManager,
        patronData: TEST_PATRON,
        addressData: TEST_NYC_ADDRESS,
      });

      // Verification
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_NYC_ADDRESS.street)
        .click();
      await pageManager.addressVerificationPage.nextButton.click();
      await expect(page).toHaveURL(/.*\/account(\?.*)?$/);

      // Account
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
      await expect(page).toHaveURL(/.*\/review(\?.*)?$/);

      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
    });
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    await expect(page).toHaveURL(/.*\/review\?.*newCard=true/);

    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();

    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("it should reach all form fields via the tab key", async ({
    page,
    browserName,
  }) => {
    const reviewPage = new ReviewPage(page);
    const isWebKit = browserName === "webkit";

    /** Helper to handle the Tab + Assertion logic */
    const tabAndCheck = async (locator) => {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    };

    await test.step("it should focus on the Edit button and activate it", async () => {
      await reviewPage.stepHeading.focus();
      await expect(reviewPage.stepHeading).toBeFocused();

      if (isWebKit) {
        // WebKit link/button tabbing is inconsistent; using click to expand section
        await reviewPage.editPersonalInfoButton.click();
      } else {
        await tabAndCheck(reviewPage.editPersonalInfoButton);
        await reviewPage.editPersonalInfoButton.press("Enter");
      }

      await expect(reviewPage.firstNameInput).toBeVisible();
      // Ensure the first field in the expanded section receives focus
      await reviewPage.firstNameInput.focus();
      await expect(reviewPage.firstNameInput).toBeFocused();
    });

    await test.step("it should tab through on Personal info fields", async () => {
      const personalFields = isWebKit
        ? [
            reviewPage.lastNameInput,
            reviewPage.dateOfBirthInput,
            reviewPage.emailInput,
          ]
        : [
            reviewPage.lastNameInput,
            reviewPage.dateOfBirthInput,
            reviewPage.emailInput,
            reviewPage.alternateFormLink,
            reviewPage.locationsLink,
            reviewPage.receiveInfoCheckbox,
          ];

      for (const field of personalFields) {
        await tabAndCheck(field);
      }
    });

    await test.step("it should tab through on Address section", async () => {
      if (isWebKit) {
        await reviewPage.editAddressButton.focus();
      } else {
        await tabAndCheck(reviewPage.editAddressButton);
      }
      await expect(reviewPage.editAddressButton).toBeFocused();
    });

    await test.step("it should tab through on Account section", async () => {
      if (!isWebKit) {
        await tabAndCheck(reviewPage.showPasswordCheckbox);
        await tabAndCheck(reviewPage.editAccountButton);
      } else {
        await reviewPage.editAccountButton.focus();
      }
      await expect(reviewPage.editAccountButton).toBeFocused();
    });

    await test.step("it should focus on the Edit Account button and activate it", async () => {
      if (isWebKit) {
        await reviewPage.editAccountButton.click();
      } else {
        await reviewPage.editAccountButton.press("Enter");
      }
      await expect(reviewPage.usernameInput).toBeVisible();
      await expect(reviewPage.usernameInput).toBeFocused();
    });

    await test.step("it should tab through on Account info fields", async () => {
      const accountLocators = isWebKit
        ? [
            reviewPage.passwordInput,
            reviewPage.verifyPasswordInput,
            reviewPage.selectHomeLibrary,
          ]
        : [
            reviewPage.passwordInput,
            reviewPage.verifyPasswordInput,
            reviewPage.showPasswordCheckbox,
            reviewPage.nyplLocationLink,
            reviewPage.selectHomeLibrary,
            reviewPage.cardholderTermsLink,
            reviewPage.rulesRegulationsLink,
            reviewPage.privacyPolicyLink,
            reviewPage.acceptTermsCheckbox,
          ];

      if (await reviewPage.availableUsernameButton.isEnabled()) {
        if (isWebKit) {
          await reviewPage.availableUsernameButton.focus();
          await expect(reviewPage.availableUsernameButton).toBeFocused();
        } else {
          await tabAndCheck(reviewPage.availableUsernameButton);
        }
      }

      for (const field of accountLocators) {
        if (isWebKit) {
          await field.focus();
          await expect(field).toBeFocused();
        } else {
          await tabAndCheck(field);
        }
      }

      if (!isWebKit) {
        if (!(await reviewPage.acceptTermsCheckbox.isChecked())) {
          await reviewPage.acceptTermsCheckbox.press("Space");
        }
        await expect(reviewPage.acceptTermsCheckbox).toBeChecked();
        await tabAndCheck(reviewPage.submitButton);
      }
    });
  });
});
