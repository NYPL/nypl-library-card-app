import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { ReviewPage } from "../../pageobjects/review.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on review page", () => {
  let reviewPage: ReviewPage;

  test.beforeEach(async ({ page }) => {
    reviewPage = new ReviewPage(page);
    await page.goto(PAGE_ROUTES.REVIEW());
  });

  test("does not display accessibility violations", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const reviewLocators = [
      reviewPage.editPersonalInfoButton,
      reviewPage.editAddressButton,
      reviewPage.showPasswordCheckbox,
      reviewPage.editAccountButton,
      reviewPage.submitButton,
    ];
    await expect(reviewPage.stepHeading).toBeFocused();
    for (const locator of reviewLocators) {
      await reviewPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });

  test("tabs forward through editable personal info section", async () => {
    const personalLocators = [
      reviewPage.lastNameInput,
      reviewPage.dateOfBirthInput,
      reviewPage.emailInput,
      reviewPage.alternateFormLink,
      reviewPage.locationsLink,
      reviewPage.receiveInfoCheckbox,
    ];
    await reviewPage.editPersonalInfoButton.focus();
    await reviewPage.page.keyboard.press("Enter");
    await expect(reviewPage.firstNameInput).toBeFocused();
    for (const locator of personalLocators) {
      await reviewPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });

  test("tabs forward through editable account section", async () => {
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
    await reviewPage.editAccountButton.focus();
    await reviewPage.page.keyboard.press("Enter");
    await expect(reviewPage.usernameInput).toBeFocused();
    for (const locator of accountLocators) {
      await reviewPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
