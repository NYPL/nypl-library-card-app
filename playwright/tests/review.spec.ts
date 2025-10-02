import { test, expect } from "@playwright/test";
import { ReviewPage } from "../pageobjects/review.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/review?newCard=true");
});

test("displays all headings", async ({ page }) => {
  const reviewPage = new ReviewPage(page);
  await expect(reviewPage.mainHeading).toBeVisible();
  await expect(reviewPage.stepHeading).toBeVisible();
  await expect(reviewPage.personalInfoHeading).toBeVisible();
});
