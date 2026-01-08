import { PersonalPage } from "../../pageobjects/personal.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on personal info page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/personal?newCard=true");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should have keyboard focus indicators for form fields", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);

    await personalPage.stepHeading.focus();
    await page.keyboard.press("Tab");
    await expect(personalPage.firstNameInput).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.lastNameInput).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.dateOfBirthInput).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.emailInput).toBeFocused();
  });

  test("should have keyboard focus validation for links, checkbox, and buttons", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);

    await personalPage.emailInput.focus();
    await personalPage.emailInput.fill("test@gmail.com");
    await page.keyboard.press("Tab");
    await expect(personalPage.alternateFormLink).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.locationsLink).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.receiveInfoCheckbox).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.previousButton).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(personalPage.nextButton).toBeFocused();
  });
});
