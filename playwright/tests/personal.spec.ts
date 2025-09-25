import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";

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

test("error validation for invalid email format", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await personalPage.emailInput.fill("testgmail.com");
  await personalPage.nextButton.click();
  await expect(personalPage.emailErrorMessage).toBeVisible();
});

test("error validation for missing email domain", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await personalPage.emailInput.fill("test@.com");
  await personalPage.nextButton.click();
  await expect(personalPage.emailErrorMessage).toBeVisible();
});

test("error validation for missing email username", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await personalPage.emailInput.fill("@gmail.com");
  await personalPage.nextButton.click();
  await expect(personalPage.emailErrorMessage).toBeVisible();
});

test("error validation for birth date less than 13 years ago", async ({
  page,
}) => {
  const personalPage = new PersonalPage(page);
  const today = new Date();
  const minDate = new Date(today.setFullYear(today.getFullYear() - 13));
  await personalPage.dateOfBirthInput.fill(minDate.toISOString().split("T")[0]);
  await personalPage.nextButton.click();
  await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();
});

test("input patron data into personal information form", async ({ page }) => {
  const personalPage = new PersonalPage(page);
  await personalPage.firstNameInput.fill("Jane");
  await personalPage.lastNameInput.fill("Doe");
  await personalPage.emailInput.fill("test@example.com");
  await personalPage.dateOfBirthInput.fill("2000-01-01");
  await personalPage.checkBox.check();
});
