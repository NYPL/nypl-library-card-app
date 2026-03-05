import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";
import { PAGE_ROUTES, SUPPORTED_LANGUAGES } from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`congrats page in ${name} (${lang})`, () => {
    let congratsPage: CongratsPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      congratsPage = new CongratsPage(page, appContent);
      await page.goto(PAGE_ROUTES.CONGRATS(lang));
    });

    test.describe("displays elements", () => {
      test("displays temporary card headings and links", async () => {
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

      test("displays partial library card", async () => {
        await expect(congratsPage.memberNameHeading).toBeVisible();
        await expect(congratsPage.issuedDateHeading).toBeVisible();
        await expect(congratsPage.issuedDate).toBeVisible();
        await expect(congratsPage.libraryCardBackground).toBeVisible();
      });

      test("confirms links open in new tab for temporary card", async () => {
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
          await expect(link).toHaveAttribute(
            "rel",
            "nofollow noopener noreferrer"
          );
        }
      });
    });
  });
}
