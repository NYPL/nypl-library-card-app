import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";
import { PAGE_ROUTES } from "../utils/constants";

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_ROUTES.CONGRATS());
});

test.describe("displays elements on Congrats page", () => {
  test("displays temporary card headings and links on congrats page", async ({
    page,
  }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.mainHeading).toBeVisible();
    await expect(congratsPage.temporaryHeading).toBeVisible();
    await expect(congratsPage.locationsLink).toBeVisible();
    await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
    await expect(congratsPage.learnMoreLink).toBeVisible();
    await expect(congratsPage.getHelpEmailLink).toBeVisible();
    await expect(congratsPage.getStartedHeading).toBeVisible();
    await expect(congratsPage.loginLink).toBeVisible();
    await expect(congratsPage.nyplLocationLink).toBeVisible();
    await expect(congratsPage.findOutLibraryLink).toBeVisible();
    await expect(congratsPage.discoverLink).toBeVisible();
  });

  test("displays partial library card on congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.memberNameHeading).toBeVisible();
    await expect(congratsPage.issuedDateHeading).toBeVisible();
    await expect(congratsPage.issuedDate).toBeVisible();
    await expect(congratsPage.libraryCardBackground).toBeVisible();
  });

  test("displays links on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.locationsLink).toBeVisible();
    await expect(congratsPage.photoIdAndProofOfAddressLink).toBeVisible();
    await expect(congratsPage.learnMoreLink).toBeVisible();
    await expect(congratsPage.getHelpEmailLink).toBeVisible();
    await expect(congratsPage.loginLink).toBeVisible();
    await expect(congratsPage.nyplLocationLink).toBeVisible();
    await expect(congratsPage.findOutLibraryLink).toBeVisible();
    await expect(congratsPage.discoverLink).toBeVisible();
  });

  test("opens links in new tab for temporary card", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    const links = [
      congratsPage.locationsLink,
      congratsPage.photoIdAndProofOfAddressLink,
      congratsPage.learnMoreLink,
      congratsPage.getHelpEmailLink,
      congratsPage.loginLink,
      congratsPage.nyplLocationLink,
      congratsPage.findOutLibraryLink,
      congratsPage.discoverLink,
    ];
    for (const link of links) {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "nofollow noopener noreferrer");
    }
  });
});
