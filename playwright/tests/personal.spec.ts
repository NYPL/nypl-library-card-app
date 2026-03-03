import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { fillPersonalInfo } from "../utils/form-helper";
import {
  PAGE_ROUTES,
  SUPPORTED_LANGUAGES,
  TEST_PATRON,
} from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`personal information page in ${name} (${lang})`, () => {
    let personalPage: PersonalPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      personalPage = new PersonalPage(page, appContent);
      await page.goto(PAGE_ROUTES.PERSONAL(lang));
    });

    test.describe("displays elements", () => {
      test("displays headings, links, and buttons", async () => {
        await expect(personalPage.mainHeading).toBeVisible();
        await expect(personalPage.stepHeading).toBeVisible();
        await expect(personalPage.alternateFormLink).toBeVisible();
        await expect(personalPage.locationsLink).toBeVisible();
        await expect(personalPage.previousButton).toBeVisible();
        await expect(personalPage.nextButton).toBeVisible();
      });

      test("displays personal information form", async () => {
        await expect(personalPage.firstNameInput).toBeVisible();
        await expect(personalPage.lastNameInput).toBeVisible();
        await expect(personalPage.dateOfBirthInput).toBeVisible();
        await expect(personalPage.emailInput).toBeVisible();
        await expect(personalPage.receiveInfoCheckbox).toBeVisible();
      });
    });

    test.describe("enters personal information", () => {
      test("enters valid personal information", async () => {
        await fillPersonalInfo(personalPage, TEST_PATRON);
        await expect(personalPage.firstNameInput).toHaveValue(
          TEST_PATRON.firstName
        );
        await expect(personalPage.lastNameInput).toHaveValue(
          TEST_PATRON.lastName
        );
        await expect(personalPage.dateOfBirthInput).toHaveValue(
          TEST_PATRON.dateOfBirth
        );
        await expect(personalPage.emailInput).toHaveValue(TEST_PATRON.email);
      });
    });

    test.describe("displays error messages", () => {
      test("displays errors for required fields", async () => {
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

      test("displays error for dashes in date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("12-25-1984");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for YYYY/MM/DD format in date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("1984/12/25");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for DD/MM/YYYY format in date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("25/12/1984");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for M/D/YY format in date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("1/1/84");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for written date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("December 25, 1984");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for earliest date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("01/01/1902");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for date of birth under 13 years old", async ({
        page,
      }) => {
        await page.clock.setFixedTime(new Date("2026-01-01T10:00:00"));
        await personalPage.dateOfBirthInput.fill("01/01/2014");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthError).toBeVisible();
      });

      test("displays error for current date of birth", async ({ page }) => {
        await page.clock.setFixedTime(new Date("2026-01-01T10:00:00"));
        await personalPage.dateOfBirthInput.fill("01/01/2026");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthError).toBeVisible();
      });

      test("displays error for future date of birth", async () => {
        await personalPage.dateOfBirthInput.fill("12/31/2099");
        await personalPage.nextButton.click();
        await expect(personalPage.dateOfBirthInvalid).toBeVisible();
      });

      test("displays error for missing email symbol", async () => {
        await personalPage.emailInput.fill("testgmail.com");
        await personalPage.nextButton.click();
        await expect(personalPage.emailError).toBeVisible();
      });

      test("displays error for missing email domain", async () => {
        await personalPage.emailInput.fill("test@.com");
        await personalPage.nextButton.click();
        await expect(personalPage.emailError).toBeVisible();
      });

      test("displays error for missing email username", async () => {
        await personalPage.emailInput.fill("@gmail.com");
        await personalPage.nextButton.click();
        await expect(personalPage.emailError).toBeVisible();
      });

      test("displays error for missing email top-level domain", async () => {
        await personalPage.emailInput.fill("user@gmail");
        await personalPage.nextButton.click();
        await expect(personalPage.emailError).toBeVisible();
      });
    });
  });
}
