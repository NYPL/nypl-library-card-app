import { PersonalPage } from "../../pageobjects/personal.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES } from "../../utils/a11y-constants";

test.describe("Accessibility tests on personal info page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_ROUTES.PERSONAL);
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should reach all form fields via the tab key", async ({ page }) => {
    const personalPage = new PersonalPage(page);

    const personalLocators = [
      personalPage.firstNameInput,
      personalPage.lastNameInput,
      personalPage.dateOfBirthInput,
      personalPage.emailInput,
    ];

    await expect(personalPage.stepHeading).toBeFocused();

    for (const locator of personalLocators) {
      await page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
