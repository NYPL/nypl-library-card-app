import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";

test.describe("E2E: Navigate backward in application", () => {
  test("navigates backward through application to landing", async ({
    page,
  }) => {
    const pageManager = new PageManager(page);

    await test.step("begins at account page", async () => {
      await page.goto("/library-card/account?newCard=true");
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await expect(pageManager.accountPage.previousButton).toBeVisible();
      await pageManager.accountPage.previousButton.click();
    });

    await test.step("displays address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await expect(
        pageManager.addressVerificationPage.previousButton
      ).toBeVisible();
      await pageManager.addressVerificationPage.previousButton.click();
    });

    await test.step("displays address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await expect(pageManager.addressPage.previousButton).toBeVisible();
      await pageManager.addressPage.previousButton.click();
    });

    await test.step("displays personal information page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await expect(pageManager.personalPage.previousButton).toBeVisible();
      await pageManager.personalPage.previousButton.click();
    });

    await test.step("displays landing page", async () => {
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
    });
  });
});
