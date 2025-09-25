import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/congrats?&newCard=true");
});

test('headings and card details display on "Congrats" page', async ({
  page,
}) => {
  const congratsPage = new CongratsPage(page);
  await expect(congratsPage.mainHeading).toBeVisible();
  await expect(congratsPage.stepHeading).toBeVisible();
});

test("the links display on Congrats page", async ({ page }) => {
  const congratsPage = new CongratsPage(page);
  await expect(congratsPage.locationsLink).toBeVisible();
  await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
  await expect(congratsPage.getHelpEmailLink).toBeVisible();
  await expect(congratsPage.loginLink).toBeVisible();
  await expect(congratsPage.findOutLibraryLink).toBeVisible();
  await expect(congratsPage.discoverLink).toBeVisible();
});
