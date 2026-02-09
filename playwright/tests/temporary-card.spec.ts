import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";
import { NON_NY_GEOLOCATION } from "../utils/constants";

test.use({
  geolocation: NON_NY_GEOLOCATION,
  permissions: ["geolocation"],
});
test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/congrats?newCard=true");
});

test.describe("Temporary Card: displays elements on Congrats page", () => {
  test("displays temporary card message on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);

    await expect(congratsPage.temporaryHeading).toBeVisible();
    await expect(congratsPage.temporaryCardBanner).toBeVisible();
    await expect(congratsPage.learnMoreLink).toBeVisible();
    await expect(congratsPage.emailLink).toBeVisible();
  });
});
