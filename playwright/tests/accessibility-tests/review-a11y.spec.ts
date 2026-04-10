import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PageManager } from "../../pageobjects/page-manager.page";
import { ReviewPage } from "../../pageobjects/review.page";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";
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
  let pageManager: PageManager;

  test.beforeEach(async ({ page, context }) => {
    pageManager = new PageManager(page);

    await context.clearCookies();
    await page.setExtraHTTPHeaders({
      "x-client-ip": IP.NYC_IP,
      "x-forwarded-for": IP.NYC_IP,
    });

    await page.goto(PAGE_ROUTES.PERSONAL);

    // Sequence to reach the Review Page
    await test.step("Setup: Navigate to Review Page", async () => {
      // Personal Info
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      const ensureValue = async (
        field: import("@playwright/test").Locator,
        value: string
      ) => {
        if ((await field.inputValue()) !== value) {
          await field.fill(value);
        }
      };

      await ensureValue(
        pageManager.personalPage.firstNameInput,
        TEST_PATRON.firstName
      );
      await ensureValue(
        pageManager.personalPage.lastNameInput,
        TEST_PATRON.lastName
      );
      await ensureValue(
        pageManager.personalPage.dateOfBirthInput,
        TEST_PATRON.dateOfBirth
      );
      await ensureValue(pageManager.personalPage.emailInput, TEST_PATRON.email);

      await Promise.all([
        page.waitForURL(/.*\/location(\?.*)?$/),
        pageManager.personalPage.nextButton.click(),
      ]);

      // Address
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_NYC_ADDRESS);
      await Promise.all([
        page.waitForURL(/.*\/address-verification(\?.*)?$/),
        pageManager.addressPage.nextButton.click(),
      ]);
      await expect(pageManager.addressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });

      // Verification
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_NYC_ADDRESS.street)
        .click();
      await Promise.all([
        page.waitForURL(/.*\/account(\?.*)?$/),
        pageManager.addressVerificationPage.nextButton.click(),
      ]);

      // Account
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await Promise.all([
        page.waitForURL(/.*\/review(\?.*)?$/),
        pageManager.accountPage.nextButton.click(),
      ]);

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
        await page.keyboard.press("Enter");
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
        await page.keyboard.press("Enter");
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
          ];

      for (const field of accountLocators) {
        await tabAndCheck(field);
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
