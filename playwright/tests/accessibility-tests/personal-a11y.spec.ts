import { PersonalPage } from "../../pageobjects/personal.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import {
  A11Y_GUIDELINES,
  validateA11yCoverage,
  pressTab,
} from "../../utils/a11y-utils";

test.describe("Accessibility tests on personal info page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.PERSONAL);
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({
    page,
    browserName,
  }) => {
    const personalPage = new PersonalPage(page);

    const locators = [
      personalPage.firstNameInput,
      personalPage.lastNameInput,
      personalPage.dateOfBirthInput,
      personalPage.emailInput,
      personalPage.alternateFormLink,
      personalPage.locationsLink,
      personalPage.receiveInfoCheckbox,
      personalPage.previousButton,
      personalPage.nextButton,
    ];

    await expect(personalPage.stepHeading).toBeFocused();

    for (const locator of locators) {
      await pressTab(page, browserName);
      await expect(locator).toBeFocused();
    }
  });
});
