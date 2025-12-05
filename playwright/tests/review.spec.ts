import { test, expect } from "@playwright/test";
import { ReviewPage } from "../pageobjects/review.page";
import {
  TEST_PATRON_INFO,
  USERNAME_AVAILABLE_MESSAGE,
  USERNAME_UNAVAILABLE_MESSAGE,
} from "../utils/constants";
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

  test("displays Create Your Account section headings", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.createYourAccountHeading).toBeVisible();
    await expect(reviewPage.usernameHeading).toBeVisible();
    await expect(reviewPage.passwordHeading).toBeVisible();
    await expect(reviewPage.showPasswordCheckbox).toBeVisible();
    await expect(reviewPage.homeLibraryHeading).toBeVisible();
    await expect(reviewPage.defaultHomeLibrary).toBeVisible();
  });
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

test.describe("mock API responses on Review page", () => {
  test("displays username available message", async ({ page }) => {
    // mock the API call for username availability
    await mockUsernameApi(page, USERNAME_AVAILABLE_MESSAGE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.accountEditButton.click();
    await reviewPage.usernameInput.fill("AvailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.availableUsernameMessage).toBeVisible();
  });

  test("displays username unavailable error message", async ({ page }) => {
    // mock the API call for username unavailability
    await mockUsernameApi(page, USERNAME_UNAVAILABLE_MESSAGE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.accountEditButton.click();
    await reviewPage.usernameInput.fill("UnavailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.unavailableUsernameError).toBeVisible();
  });
});
