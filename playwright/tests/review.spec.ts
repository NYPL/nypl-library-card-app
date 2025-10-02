import { test, expect } from "@playwright/test";
import { ReviewPage } from "../pageobjects/review.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/review?newCard=true");
});

test("displays headings", async ({ page }) => {
  const reviewPage = new ReviewPage(page);
  await expect(reviewPage.mainHeading).toBeVisible();
  await expect(reviewPage.stepHeading).toBeVisible();
});

test.describe("displays personal information section", () => {
  test("displays personal information headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.personalInfoHeading).toBeVisible();
    await expect(reviewPage.firstNameHeading).toBeVisible();
    await expect(reviewPage.lastNameHeading).toBeVisible();
    await expect(reviewPage.dateOfBirthHeading).toBeVisible();
    await expect(reviewPage.emailHeading).toBeVisible();
    await expect(reviewPage.receiveInfoHeading).toBeVisible();
  });

  test("displays patron information", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.receiveInfoChoice).toBeVisible();
  });
});
