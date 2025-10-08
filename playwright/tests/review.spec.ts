import { test, expect } from "@playwright/test";
import { ReviewPage } from "../pageobjects/review.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/review?newCard=true");
});

test.describe("displays elements on review page", () => {
  test("displays headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.mainHeading).toBeVisible();
    await expect(reviewPage.stepHeading).toBeVisible();
  });

  test("displays Personal Information section headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.personalInfoHeading).toBeVisible();
    await expect(reviewPage.firstNameHeading).toBeVisible();
    await expect(reviewPage.lastNameHeading).toBeVisible();
    await expect(reviewPage.dateOfBirthHeading).toBeVisible();
    await expect(reviewPage.emailHeading).toBeVisible();
    await expect(reviewPage.receiveInfoHeading).toBeVisible();
  });

  // test: displays home address section headings
  // test: displays alternate address section headings
  // test: displays create your account section headings
  // test: displays submit button
});
