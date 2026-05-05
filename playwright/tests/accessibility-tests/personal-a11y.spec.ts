import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";
import { PersonalPage } from "../../pageobjects/personal.page";
import { PAGE_ROUTES } from "../../utils/constants";
import { A11Y_GUIDELINES, validateA11yCoverage } from "../../utils/a11y-utils";

test.describe("accessibility tests on personal page", () => {
  let personalPage: PersonalPage;

  test.beforeEach(async ({ page }) => {
    personalPage = new PersonalPage(page);
    await page.goto(PAGE_ROUTES.PERSONAL());
  });

  test("does not have accessibility violations on page", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags([...A11Y_GUIDELINES])
      .analyze();
    validateA11yCoverage(accessibilityScanResults);
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("tabs forward through the page", async () => {
    const personalLocators = [
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
    for (const locator of personalLocators) {
      await personalPage.page.keyboard.press("Tab");
      await expect(locator).toBeFocused();
    }
  });
});
