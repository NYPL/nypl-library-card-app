import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { ReviewPage } from "../pageobjects/review.page";
import {
  TEST_CUSTOMIZE_ACCOUNT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON_INFO,
  ERROR_MESSAGES,
} from "../utils/constants";
import {
  fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../utils/form-helper";
import { mockUsernameApi } from "../utils/mock-api";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/review?newCard=true");
});

test.describe("displays elements on review page", () => {
  test("displays headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.mainHeading).toBeVisible();
    await expect(reviewPage.stepHeading).toBeVisible();
  });

  test("displays Personal Information section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.personalInfoHeading).toBeVisible();
    await expect(reviewPage.firstNameHeading).toBeVisible();
    await expect(reviewPage.lastNameHeading).toBeVisible();
    await expect(reviewPage.dateOfBirthHeading).toBeVisible();
    await expect(reviewPage.emailHeading).toBeVisible();
    await expect(reviewPage.receiveInfoHeading).toBeVisible();
    await expect(reviewPage.receiveInfoChoice).toBeVisible();
  });

  test("displays Address section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.addressHeading).toBeVisible();
    await expect(reviewPage.streetHeading).toBeVisible();
    await expect(reviewPage.cityHeading).toBeVisible();
    await expect(reviewPage.stateHeading).toBeVisible();
    await expect(reviewPage.postalCodeHeading).toBeVisible();
  });

  test("displays Account section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.createYourAccountHeading).toBeVisible();
    await expect(reviewPage.usernameHeading).toBeVisible();
    await expect(reviewPage.passwordHeading).toBeVisible();
    await expect(reviewPage.showPasswordLabel).toBeVisible();
    await expect(reviewPage.homeLibraryHeading).toBeVisible();
  });
});

test.describe("edits patron information on review page", () => {
  test("displays editable Personal information section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editPersonalInfoButton).toBeVisible();
    await reviewPage.editPersonalInfoButton.click();
    await expect(reviewPage.firstNameInputHeading).toBeVisible();
    await expect(reviewPage.firstNameInput).toBeVisible();
    await expect(reviewPage.lastNameInputHeading).toBeVisible();
    await expect(reviewPage.lastNameInput).toBeVisible();
    await expect(reviewPage.dateOfBirthInputHeading).toBeVisible();
    await expect(reviewPage.dateOfBirthInput).toBeVisible();
    await expect(reviewPage.emailInputHeading).toBeVisible();
    await expect(reviewPage.emailInput).toBeVisible();
    await expect(reviewPage.alternateFormLink).toBeVisible();
    await expect(reviewPage.locationsLink).toBeVisible();
    await expect(reviewPage.receiveInfoCheckbox).toBeVisible();
  });

  // does not replace personal info since there's no existing text
  test("enters Personal information", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await fillPersonalInfo(reviewPage);
    await reviewPage.receiveInfoCheckbox.click(); // unable to check()

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

  test("edits addresses", async ({ page }) => {
    const pageManager = new PageManager(page);

    await test.step("clicks edit button", async () => {
      await expect(pageManager.reviewPage.editAddressButton).toBeVisible();
      await pageManager.reviewPage.editAddressButton.click();
      await page.waitForURL(/\/location/);
    });

    await test.step("navigates to address page and enters address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("confirms addresses", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await pageManager.addressVerificationPage
        .getHomeAddressOption(TEST_OOS_ADDRESS.street)
        .check();
      await pageManager.addressVerificationPage
        .getAlternateAddressOption(TEST_NYC_ADDRESS.street)
        .check();
      await pageManager.addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays addresses on review page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_OOS_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_NYC_ADDRESS.street)
      ).toBeVisible();
    });
  });

  test("displays editable Account section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editAccountButton).toBeVisible();
    await reviewPage.editAccountButton.click();
    await expect(reviewPage.usernameInputHeading).toBeVisible();
    await expect(reviewPage.usernameInput).toBeVisible();
    await expect(reviewPage.passwordInputHeading).toBeVisible();
    await expect(reviewPage.passwordInput).toBeVisible();
    await expect(reviewPage.verifyPasswordInputHeading).toBeVisible();
    await expect(reviewPage.verifyPasswordInput).toBeVisible();
    await expect(reviewPage.showPasswordLabel).toBeVisible();
    await expect(reviewPage.selectHomeLibrary).toBeVisible();
    await expect(reviewPage.cardholderTermsLink).toBeVisible();
    await expect(reviewPage.rulesRegulationsLink).toBeVisible();
    await expect(reviewPage.privacyPolicyLink).toBeVisible();
    await expect(reviewPage.acceptTermsLabel).toBeVisible();
  });

  // does not replace account info since there's no existing text
  test("enters account information", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await fillAccountInfo(reviewPage);

    await expect(reviewPage.usernameInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.username
    );
    await reviewPage.showPasswordLabel.check();
    await expect(reviewPage.passwordInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.password
    );
    await expect(reviewPage.verifyPasswordInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.password
    );
    await expect(reviewPage.selectHomeLibrary).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.homeLibrary
    );
    await expect(reviewPage.acceptTermsLabel).toBeChecked();
  });
});

test.describe("mocks API responses on review page", () => {
  test("displays username available message", async ({ page }) => {
    // mock the API call for username availability
    await mockUsernameApi(page, ERROR_MESSAGES.USERNAME_AVAILABLE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("AvailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.availableUsernameMessage).toBeVisible();
  });

  test("displays username unavailable error message", async ({ page }) => {
    // mock the API call for username unavailability
    await mockUsernameApi(page, ERROR_MESSAGES.USERNAME_UNAVAILABLE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("UnavailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.unavailableUsernameMessage).toBeVisible();
  });
});

test.describe("displays error messages", () => {
  test("displays errors for required fields", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.firstNameInput.fill("");
    await reviewPage.lastNameInput.fill("");
    await reviewPage.dateOfBirthInput.fill("");
    await reviewPage.emailInput.fill("");
    await reviewPage.submitButton.click();
    await expect(reviewPage.firstNameError).toBeVisible();
    await expect(reviewPage.lastNameError).toBeVisible();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
    await expect(reviewPage.emailError).toBeVisible();
  });

  test("displays error for dashes in date of birth", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("12-25-1984");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for YYYY/MM/DD format in date of birth", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("1984/12/25");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for DD/MM/YYYY format in date of birth", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("25/12/1984");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for M/D/YY format in date of birth", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("1/1/84");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for written date of birth", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("December 25, 1984");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for earliest date of birth", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("01/01/1902");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for current date of birth", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await page.clock.setFixedTime(new Date("2026-01-01T10:00:00"));
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("01/01/2026");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for future date of birth", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.dateOfBirthInput.fill("12/31/2099");
    await reviewPage.submitButton.click();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
  });

  test("displays error for missing email symbol", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.emailInput.fill("testgmail.com");
    await reviewPage.submitButton.click();
    await expect(reviewPage.emailError).toBeVisible();
  });

  test("displays error for missing email domain", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.emailInput.fill("test@.com");
    await reviewPage.submitButton.click();
    await expect(reviewPage.emailError).toBeVisible();
  });

  test("displays error for missing email username", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.emailInput.fill("@gmail.com");
    await reviewPage.submitButton.click();
    await expect(reviewPage.emailError).toBeVisible();
  });

  test("displays error for missing email top-level domain", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editPersonalInfoButton.click();
    await reviewPage.emailInput.fill("user@gmail");
    await reviewPage.submitButton.click();
    await expect(reviewPage.emailError).toBeVisible();
  });

  test("displays error for empty username and password", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("");
    await reviewPage.passwordInput.fill("");
    await reviewPage.submitButton.click();
    await expect(reviewPage.usernameError).toBeVisible();
    await expect(reviewPage.passwordError).toBeVisible();
  });

  test("displays error for username with special characters", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("User!@#");
    await reviewPage.submitButton.click();
    await expect(reviewPage.usernameError).toBeVisible();
  });

  test("displays error for username with non-Latin characters", async ({
    page,
  }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("用戶名用戶名");
    await reviewPage.submitButton.click();
    await expect(reviewPage.usernameError).toBeVisible();
  });

  test("displays error when passwords do not match", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("ValidUser1");
    await reviewPage.passwordInput.fill("ValidPass1!");
    await reviewPage.verifyPasswordInput.fill("DifferentPass1!");
    await reviewPage.submitButton.click();
    await expect(reviewPage.verifyPasswordError).toBeVisible();
  });

  test("displays error with too many characters", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("ABCDEFGHIJKLMNOPQRSTUVWXYZ");
    await reviewPage.passwordInput.fill("123456789012345678901234567890123");
    await reviewPage.submitButton.click();
    await expect(reviewPage.usernameError).toBeVisible();
    await expect(reviewPage.passwordError).toBeVisible();
  });

  test("displays error with too few characters", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("A");
    await reviewPage.passwordInput.fill("1!");
    await reviewPage.submitButton.click();
    await expect(reviewPage.usernameError).toBeVisible();
    await expect(reviewPage.passwordError).toBeVisible();
  });

  test("displays error when terms are not accepted", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("ValidUser1");
    await reviewPage.passwordInput.fill("ValidPass1!");
    await reviewPage.verifyPasswordInput.fill("ValidPass1!");
    await reviewPage.submitButton.click();
    await expect(reviewPage.acceptTermsError).toBeVisible();
  });

  test("displays errors when submitting empty form", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.submitButton.click();
    await expect(reviewPage.firstNameError).toBeVisible();
    await expect(reviewPage.lastNameError).toBeVisible();
    await expect(reviewPage.dateOfBirthError).toBeVisible();
    await expect(reviewPage.emailError).toBeVisible();
    await expect(reviewPage.usernameError).toBeVisible();
    await expect(reviewPage.passwordError).toBeVisible();
    await expect(reviewPage.verifyPasswordError).toBeVisible();
    await expect(reviewPage.homeLibraryError).toBeVisible();
    await expect(reviewPage.acceptTermsError).toBeVisible();
    await expect(reviewPage.streetAddressInvalid).toBeVisible();
    await expect(reviewPage.cityError).toBeVisible();
    await expect(reviewPage.stateError).toBeVisible();
    await expect(reviewPage.postalCodeError).toBeVisible();
  });
});
