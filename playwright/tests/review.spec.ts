import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { ReviewPage } from "../pageobjects/review.page";
import { TEST_PATRON_INFO } from "../utils/constants";
import { fillPersonalInfo } from "../utils/form-helper";

test.describe("displays elements on Confirm Your Information page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/review?newCard=true");
  });

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
});

test("displays patron information", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await fillPersonalInfo(personalPage);
  personalPage.nextButton.click();

  await page.goto("/library-card/review?newCard=true");
  const reviewPage = new ReviewPage(page);
  // await expect(page.TEST_PATRON_INFO.firstName).toBeVisible();
  await expect(reviewPage.receiveInfoChoice).toBeVisible();
});
