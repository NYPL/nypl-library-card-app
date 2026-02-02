import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { SUPPORTED_LANGUAGES /*TEST_PATRON_INFO*/ } from "../utils/constants";
// import { fillPersonalInfo } from "../utils/form-helper";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`personal information page in ${name} (${lang})`, () => {
    let personalPage: PersonalPage;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      personalPage = new PersonalPage(page, appContent);
      await page.goto(`/library-card/personal?newCard=true&lang=${lang}`);
    });

    test.describe("displays elements on personal information page", () => {
      test("displays headings", async () => {
        await expect(personalPage.mainHeading).toBeVisible();
        await expect(personalPage.stepHeading).toBeVisible();
      });

      test("displays personal information form", async () => {
        await expect(personalPage.firstNameInput).toBeVisible();
        await expect(personalPage.lastNameInput).toBeVisible();
        await expect(personalPage.dateOfBirthInput).toBeVisible();
        await expect(personalPage.emailInput).toBeVisible();
        await expect(personalPage.receiveInfoCheckbox).toBeVisible();
      });

      test("displays links", async () => {
        await expect(personalPage.alternateFormLink).toBeVisible();
        await expect(personalPage.locationsLink).toBeVisible();
      });

      test("displays next and previous buttons", async () => {
        await expect(personalPage.previousButton).toBeVisible();
        await expect(personalPage.nextButton).toBeVisible();
      });
    });
  });
}

// test.describe("enters personal information", () => {
//   test("enters valid personal information", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await fillPersonalInfo(personalPage);
//     await expect(personalPage.firstNameInput).toHaveValue(
//       TEST_PATRON_INFO.firstName
//     );
//     await expect(personalPage.lastNameInput).toHaveValue(
//       TEST_PATRON_INFO.lastName
//     );
//     await expect(personalPage.dateOfBirthInput).toHaveValue(
//       TEST_PATRON_INFO.dateOfBirth
//     );
//     await expect(personalPage.emailInput).toHaveValue(TEST_PATRON_INFO.email);
//   });
// });

// test.describe("displays error messages", () => {
//   test("displays errors for required fields", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.firstNameInput.fill("");
//     await personalPage.lastNameInput.fill("");
//     await personalPage.dateOfBirthInput.fill("");
//     await personalPage.emailInput.fill("");
//     await personalPage.nextButton.click();

//     await expect(personalPage.firstNameError).toBeVisible();
//     await expect(personalPage.lastNameError).toBeVisible();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//     await expect(personalPage.emailError).toBeVisible();
//   });

//   test("displays error for dashes in date of birth", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("12-25-1984");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for YYYY/MM/DD format in date of birth", async ({
//     page,
//   }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("1984/12/25");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for DD/MM/YYYY format in date of birth", async ({
//     page,
//   }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("25/12/1984");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for M/D/YY format in date of birth", async ({
//     page,
//   }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("1/1/84");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for written date of birth", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("December 25, 1984");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for future date of birth", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.dateOfBirthInput.fill("12/31/2099");
//     await personalPage.nextButton.click();
//     await expect(personalPage.dateOfBirthError).toBeVisible();
//   });

//   test("displays error for missing email symbol", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.emailInput.fill("testgmail.com");
//     await personalPage.nextButton.click();
//     await expect(personalPage.emailError).toBeVisible();
//   });

//   test("displays error for missing email domain", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.emailInput.fill("test@.com");
//     await personalPage.nextButton.click();
//     await expect(personalPage.emailError).toBeVisible();
//   });

//   test("displays error for missing email username", async ({ page }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.emailInput.fill("@gmail.com");
//     await personalPage.nextButton.click();
//     await expect(personalPage.emailError).toBeVisible();
//   });

//   test("displays error for missing email top-level domain", async ({
//     page,
//   }) => {
//     const personalPage = new PersonalPage(page);
//     await personalPage.emailInput.fill("user@gmail");
//     await personalPage.nextButton.click();
//     await expect(personalPage.emailError).toBeVisible();
//   });
// });
