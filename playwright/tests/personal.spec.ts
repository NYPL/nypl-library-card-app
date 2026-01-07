import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { TEST_PATRON_INFO } from "../utils/constants";
import { fillPersonalInfo } from "../utils/form-helper";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/personal?newCard=true");
});

test.describe("displays elements on personal information page", () => {
  test("displays headings", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await expect(personalPage.mainHeading).toBeVisible();
    await expect(personalPage.stepHeading).toBeVisible();
  });

  test("displays personal information form", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await expect(personalPage.firstNameInput).toBeVisible();
    await expect(personalPage.lastNameInput).toBeVisible();
    await expect(personalPage.dateOfBirthInput).toBeVisible();
    await expect(personalPage.emailInput).toBeVisible();
    await expect(personalPage.receiveInfoCheckbox).toBeVisible();
  });

  test("displays links", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await expect(personalPage.alternateFormLink).toBeVisible();
    await expect(personalPage.locationsLink).toBeVisible();
  });

  test("displays next and previous buttons", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await expect(personalPage.previousButton).toBeVisible();
    await expect(personalPage.nextButton).toBeVisible();
  });
});

test.describe("enters personal information", () => {
  test("enters valid personal information", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await fillPersonalInfo(personalPage);
    await expect(personalPage.firstNameInput).toHaveValue(
      TEST_PATRON_INFO.firstName
    );
    await expect(personalPage.lastNameInput).toHaveValue(
      TEST_PATRON_INFO.lastName
    );
    await expect(personalPage.dateOfBirthInput).toHaveValue(
      TEST_PATRON_INFO.dateOfBirth
    );
    await expect(personalPage.emailInput).toHaveValue(TEST_PATRON_INFO.email);
  });
});

test.describe("displays error messages", () => {
  test("displays errors for required fields", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.firstNameInput.fill("");
    await personalPage.lastNameInput.fill("");
    await personalPage.dateOfBirthInput.fill("");
    await personalPage.emailInput.fill("");
    await personalPage.nextButton.click();

    await expect(personalPage.firstNameErrorMessage).toBeVisible();
    await expect(personalPage.lastNameErrorMessage).toBeVisible();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();
    await expect(personalPage.emailErrorMessage).toBeVisible();
  });

  test("displays error for invalid date of birth format", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("12-25-1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();

    await personalPage.dateOfBirthInput.fill("1984/12/25");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();

    await personalPage.dateOfBirthInput.fill("25/12/1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();

    await personalPage.dateOfBirthInput.fill("1/1/84");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();

    await personalPage.dateOfBirthInput.fill("December 25, 1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();
  });

  test("displays error for future date of birth", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("12/31/2099");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthErrorMessage).toBeVisible();
  });

  test("displays error for missing email symbol", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("testgmail.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailErrorMessage).toBeVisible();
  });

  test("displays error for missing email domain", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("test@.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailErrorMessage).toBeVisible();
  });

  test("displays error for missing email username", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("@gmail.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailErrorMessage).toBeVisible();
  });

  test("displays error for missing email top-level domain", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("user@gmail");
    await personalPage.nextButton.click();
    await expect(personalPage.emailErrorMessage).toBeVisible();
  });
});
