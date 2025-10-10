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
  test("displays Address section headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.addressHeading).toBeVisible();
    await expect(reviewPage.streetHeading).toBeVisible();
    await expect(reviewPage.cityHeading).toBeVisible();
    await expect(reviewPage.stateHeading).toBeVisible();
    await expect(reviewPage.postalCodeHeading).toBeVisible();
    await expect(reviewPage.addressEditButton).toBeVisible();
    await expect(reviewPage.addressEditButton).toBeEnabled();
  });
});
