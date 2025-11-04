import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/congrats?&newCard=true");
});

test.describe("displays elements on Congrats page", () => {
  test("displays headings on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.mainHeading).toBeVisible();
    await expect(congratsPage.stepHeading).toBeVisible();
    await expect(congratsPage.getStartedHeading).toBeVisible();
  });

  test("displays library card on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.memberNameHeading).toBeVisible();
    await expect(congratsPage.issuedDateHeading).toBeVisible();
    const DATE_FORMAT_REGEX = /\d{1,2}\/\d{1,2}\/\d{4}/;
    await expect(congratsPage.issuedDate).toHaveText(DATE_FORMAT_REGEX);
    await expect(congratsPage.libraryCardBackground).toBeVisible();
  });

  test("displays links on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.locationsLink).toBeVisible();
    await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
    await expect(congratsPage.getHelpEmailLink).toBeVisible();
    await expect(congratsPage.loginLink).toBeVisible();
    await expect(congratsPage.findOutLibraryLink).toBeVisible();
    await expect(congratsPage.discoverLink).toBeVisible();
  });
});
