import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { PAGE_ROUTES, TEST_PATRON } from "../utils/constants";
import { fillPersonalInfo } from "../utils/form-helper";

test.beforeEach(async ({ page }) => {
  await page.goto(PAGE_ROUTES.PERSONAL);
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
    await fillPersonalInfo(personalPage, TEST_PATRON);
    await expect(personalPage.firstNameInput).toHaveValue(
      TEST_PATRON.firstName
    );
    await expect(personalPage.lastNameInput).toHaveValue(TEST_PATRON.lastName);
    await expect(personalPage.dateOfBirthInput).toHaveValue(
      TEST_PATRON.dateOfBirth
    );
    await expect(personalPage.emailInput).toHaveValue(TEST_PATRON.email);
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

    await expect(personalPage.firstNameError).toBeVisible();
    await expect(personalPage.lastNameError).toBeVisible();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
    await expect(personalPage.emailError).toBeVisible();
  });

  test("displays error for dashes in date of birth", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("12-25-1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for YYYY/MM/DD format in date of birth", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("1984/12/25");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for DD/MM/YYYY format in date of birth", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("25/12/1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for M/D/YY format in date of birth", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("1/1/84");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for written date of birth", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("December 25, 1984");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for earliest date of birth", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("01/01/1902");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for date of birth in current year", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await page.clock.setFixedTime(new Date("2026-01-01T10:00:00"));
    await personalPage.dateOfBirthInput.fill("01/01/2026");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for date of birth under 13 years old", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await page.clock.setFixedTime(new Date("2026-01-01T10:00:00"));
    await personalPage.dateOfBirthInput.fill("01/01/2014");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for future date of birth", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.dateOfBirthInput.fill("12/31/2099");
    await personalPage.nextButton.click();
    await expect(personalPage.dateOfBirthInvalid).toBeVisible();
  });

  test("displays error for missing email symbol", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("testgmail.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailError).toBeVisible();
  });

  test("displays error for missing email domain", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("test@.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailError).toBeVisible();
  });

  test("displays error for missing email username", async ({ page }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("@gmail.com");
    await personalPage.nextButton.click();
    await expect(personalPage.emailError).toBeVisible();
  });

  test("displays error for missing email top-level domain", async ({
    page,
  }) => {
    const personalPage = new PersonalPage(page);
    await personalPage.emailInput.fill("user@gmail");
    await personalPage.nextButton.click();
    await expect(personalPage.emailError).toBeVisible();
  });
});
