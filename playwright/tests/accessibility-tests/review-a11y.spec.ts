import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { ReviewPage } from "../../pageobjects/review.page";
import {
  A11Y_GUIDELINES,
  validateA11yCoverage,
  pressTab,
} from "../../utils/a11y-utils";
import { navigateToReviewPage } from "../../utils/navigation-helper";
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

    await test.step("Setup: Navigate to Review Page", async () => {
      await navigateToReviewPage({
        page,
        pageManager,
        patronData: TEST_PATRON,
        addressData: TEST_NYC_ADDRESS,
        accountData: TEST_ACCOUNT,
      });
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
    const tabAndCheck = async (locator) => {
      await pressTab(page, browserName);
      await expect(locator).toBeFocused();
    };

    await test.step("it should focus on the Edit button and activate it", async () => {
      await expect(reviewPage.stepHeading).toBeVisible();
      await expect(reviewPage.stepHeading).toBeFocused();

      await tabAndCheck(reviewPage.editPersonalInfoButton);
      await reviewPage.editPersonalInfoButton.press("Enter");

      await expect(reviewPage.firstNameInput).toBeVisible();
      await expect(reviewPage.firstNameInput).toBeFocused();
    });

    await test.step("it should tab through on Personal info fields", async () => {
      const personalFields = [
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
      await tabAndCheck(reviewPage.editAddressButton);
      await expect(reviewPage.editAddressButton).toBeFocused();
    });

    await test.step("it should tab through on Account section", async () => {
      await tabAndCheck(reviewPage.showPasswordCheckbox);
      await tabAndCheck(reviewPage.editAccountButton);
      await expect(reviewPage.editAccountButton).toBeFocused();
    });

    await test.step("it should focus on the Edit Account button and activate it", async () => {
      await reviewPage.editAccountButton.press("Enter");
      await expect(reviewPage.usernameInput).toBeVisible();
      await expect(reviewPage.usernameInput).toBeFocused();
    });

    await test.step("it should tab through on Account info fields", async () => {
      const accountLocators = [
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
        await tabAndCheck(reviewPage.availableUsernameButton);
      }

      for (const field of accountLocators) {
        await tabAndCheck(field);
      }

      if (!(await reviewPage.acceptTermsCheckbox.isChecked())) {
        await reviewPage.acceptTermsCheckbox.press("Space");
      }
      await expect(reviewPage.acceptTermsCheckbox).toBeChecked();
      await tabAndCheck(reviewPage.submitButton);
    });
  });
});
