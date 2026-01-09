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
    browserName,
  }) => {
    const personalPage = new PersonalPage(page);
    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }

    await personalPage.firstNameInput.focus();
    await expect(personalPage.firstNameInput).toBeFocused();
    await personalPage.firstNameInput.fill("John");

    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(personalPage.lastNameInput).toBeFocused();
    await personalPage.lastNameInput.fill("Doe");
    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(personalPage.dateOfBirthInput).toBeFocused();
    await personalPage.dateOfBirthInput.fill("03/30/2003");

    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(personalPage.emailInput).toBeFocused();
    await personalPage.emailInput.fill("test@gmail.com");

    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    if (
      (await personalPage.alternateFormLink.isVisible()) &&
      (await personalPage.alternateFormLink.isEnabled())
    ) {
      await expect(personalPage.alternateFormLink).toBeFocused();
    }

    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }

    if (
      (await personalPage.locationsLink.isVisible()) &&
      (await personalPage.locationsLink.isEnabled())
    ) {
      await expect(personalPage.locationsLink).toBeFocused();
    }
    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    if (
      (await personalPage.receiveCheckboxA11y.isVisible()) &&
      (await personalPage.receiveCheckboxA11y.isEnabled())
    ) {
      await expect(personalPage.receiveCheckboxA11y).toBeFocused();
    }
    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(personalPage.previousButton).toBeFocused();

    if (browserName === "webkit") {
      await page.keyboard.press("Alt+Tab");
    } else {
      await page.keyboard.press("Tab");
    }
    await expect(personalPage.nextButton).toBeFocused();
  });
});
