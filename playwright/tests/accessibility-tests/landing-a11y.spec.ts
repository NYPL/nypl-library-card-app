import { LandingPage } from "../../pageobjects/landing.page";
import { test, expect } from "@playwright/test";
import { AxeBuilder } from "@axe-core/playwright";

test.describe("Accessibility tests on Landing Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/new");
  });

  test("should have no accessibility violations on load", async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(["wcag21aa", "wcag22aa"])
      .analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
  });

  test("should have accessible names", async ({ page }) => {
    const landingPage = new LandingPage(page);
    await expect(landingPage.arabicLanguage).toHaveAccessibleName(
      "Arabic | العَرَبِية"
    );
    await expect(landingPage.bengaliLanguage).toHaveAccessibleName(
      "Bengali | বাঙালি"
    );
    await expect(landingPage.chineseLanguage).toHaveAccessibleName(
      "Chinese (Simplified) | 简体中文"
    );
    await expect(landingPage.englishLanguage).toHaveAccessibleName("English");
    await expect(landingPage.frenchLanguage).toHaveAccessibleName(
      "French | Français"
    );
    await expect(landingPage.haitianCreoleLanguage).toHaveAccessibleName(
      "Haitian Creole | Kreyòl Ayisyen"
    );
    await expect(landingPage.koreanLanguage).toHaveAccessibleName(
      "Korean | 한국어"
    );
    await expect(landingPage.polishLanguage).toHaveAccessibleName(
      "Polish | Polski"
    );
    await expect(landingPage.russianLanguage).toHaveAccessibleName(
      "Russian | Русский"
    );
    await expect(landingPage.spanishLanguage).toHaveAccessibleName(
      "Spanish | Español"
    );
    await expect(landingPage.urduLanguage).toHaveAccessibleName(
      "Urdu | اُردُو"
    );
    await expect(landingPage.getStartedButton).toHaveAccessibleName(
      "Get started"
    );
  });

  test("should have keyboard focus indicators for language links", async ({
    page,
    browserName,
  }) => {
    const landingPage = new LandingPage(page);
    const tabKey = browserName === "webkit" ? "Alt+Tab" : "Tab";

    await landingPage.arabicLanguage.focus();
    await page.keyboard.press(tabKey);
    await expect(landingPage.bengaliLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.chineseLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.englishLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.frenchLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.haitianCreoleLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.koreanLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.polishLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.russianLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.spanishLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
    await expect(landingPage.urduLanguage).toBeFocused();
    await page.keyboard.press(tabKey);
  });
});
