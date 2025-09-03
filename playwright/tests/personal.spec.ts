import { test, expect } from "@playwright/test";
import { PersonalPage } from "./pageobjects/personal.page";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/personal?newCard=true");
});

test("Display personal information form", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await expect(personalPage.firstNameInput).toBeVisible();
  await expect(personalPage.lastNameInput).toBeVisible();
  await expect(personalPage.emailInput).toBeVisible();
  await expect(personalPage.dateOfBirthInput).toBeVisible();
  await expect(personalPage.checkBox).toBeVisible();
  await expect(personalPage.previousButton).toBeVisible();
  await expect(personalPage.nextButton).toBeVisible();
});

test("error validation for empty personal info form", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await personalPage.firstNameInput.fill("");
  await personalPage.lastNameInput.fill("");
  await personalPage.emailInput.fill("");
  await personalPage.dateOfBirthInput.fill("");

  await personalPage.nextButton.click();

  await expect(personalPage.firstNameErrorMessage).toBeVisible();
  await expect(personalPage.lastNameErrorMessage).toBeVisible();
  await expect(personalPage.emailErrorMessage).toBeVisible();
  await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();
});
