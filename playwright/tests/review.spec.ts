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

test.describe("edits patron information on review page", () => {
  test("displays editable Personal Information section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editPersonalInfoButton).toBeVisible();
    await reviewPage.editPersonalInfoButton.click();
    await expect(reviewPage.firstNameInput).toBeVisible();
    await expect(reviewPage.lastNameInput).toBeVisible();
    await expect(reviewPage.dateOfBirthInput).toBeVisible();
    await expect(reviewPage.emailInput).toBeVisible();
    await expect(reviewPage.receiveInfoCheckbox).toBeVisible();
    await expect(reviewPage.alternateFormLink).toBeVisible();
    await expect(reviewPage.locationsLink).toBeVisible();
  });

  // does not replace personal info since there's no existing text
  test("enters Personal Information", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.firstNameInput.fill(TEST_PATRON_INFO.firstName);
    await reviewPage.lastNameInput.fill(TEST_PATRON_INFO.lastName);
    await reviewPage.dateOfBirthInput.fill(TEST_PATRON_INFO.dateOfBirth);
    await reviewPage.emailInput.fill(TEST_PATRON_INFO.email);
    await reviewPage.receiveInfoCheckbox.click();

    await expect(reviewPage.firstNameInput).toHaveValue(
      TEST_PATRON_INFO.firstName
    );
    await expect(reviewPage.lastNameInput).toHaveValue(
      TEST_PATRON_INFO.lastName
    );
    await expect(reviewPage.dateOfBirthInput).toHaveValue(
      TEST_PATRON_INFO.dateOfBirth
    );
    await expect(reviewPage.emailInput).toHaveValue(TEST_PATRON_INFO.email);
    await expect(reviewPage.receiveInfoCheckbox).not.toBeChecked();
  });
});
