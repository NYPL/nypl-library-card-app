import { test, expect } from "@playwright/test";
import { CongratsPage } from "../pageobjects/congrats.page";

test.use({
  geolocation: {
    latitude: 48.8566,
    longitude: 2.3522,
  },
  permissions: ["geolocation"],
});
test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/congrats?newCard=true");
});

test.describe("Temporary Card: displays elements on Congrats page", () => {
  test("displays temporary card message on Congrats page", async ({ page }) => {
    const congratsPage = new CongratsPage(page);
    await expect(congratsPage.temporaryCardBanner).toBeVisible();
    await expect(congratsPage.learnMoreLink).toBeVisible();
    await expect(congratsPage.emailLink).toBeVisible();
  });
});
