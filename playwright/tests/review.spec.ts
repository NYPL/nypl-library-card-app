import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import { ReviewPage } from "../pageobjects/review.page";
import {
  TEST_ALTERNATE_ADDRESS,
  TEST_CUSTOMIZE_ACCOUNT,
  TEST_HOME_ADDRESS,
  TEST_PATRON_INFO,
  USERNAME_AVAILABLE_MESSAGE,
  USERNAME_UNAVAILABLE_MESSAGE,
} from "../utils/constants";
import {
  fillAccountInfo,
  fillAlternateAddress,
  fillHomeAddress,
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
    await expect(reviewPage.showPasswordCheckbox).toBeVisible();
    await expect(reviewPage.homeLibraryHeading).toBeVisible();
    await expect(
      reviewPage.getText(TEST_CUSTOMIZE_ACCOUNT.defaultLibrary)
    ).toBeVisible();
  });
});

test.describe("edits patron information on review page", () => {
  test("displays editable Personal information section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editPersonalInfoButton).toBeVisible();
    await reviewPage.editPersonalInfoButton.click();
    await expect(reviewPage.firstNameInput).toBeVisible();
    await expect(reviewPage.lastNameInput).toBeVisible();
    await expect(reviewPage.dateOfBirthInput).toBeVisible();
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
      await fillHomeAddress(pageManager.addressPage);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(pageManager.alternateAddressPage);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("confirms addresses", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await pageManager.addressVerificationPage.homeAddressOption.check();
      await pageManager.addressVerificationPage.alternateAddressOption.check();
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
        pageManager.reviewPage.getText(TEST_HOME_ADDRESS.street)
      ).toBeVisible();
      await expect(
        pageManager.reviewPage.getText(TEST_ALTERNATE_ADDRESS.street)
      ).toBeVisible();
    });
  });

  test("displays editable Account section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editAccountButton).toBeVisible();
    await reviewPage.editAccountButton.click();
    await expect(reviewPage.usernameInput).toBeVisible();
    await expect(reviewPage.passwordInput).toBeVisible();
    await expect(reviewPage.verifyPasswordInput).toBeVisible();
    await expect(reviewPage.showPasswordCheckbox).toBeVisible();
    await expect(reviewPage.selectHomeLibrary).toBeVisible();
    await expect(reviewPage.cardholderTermsLink).toBeVisible();
    await expect(reviewPage.rulesRegulationsLink).toBeVisible();
    await expect(reviewPage.privacyPolicyLink).toBeVisible();
    await expect(reviewPage.acceptTermsCheckbox).toBeVisible();
  });

  // does not replace account info since there's no existing text
  test("enters Account information", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await fillAccountInfo(reviewPage);

    await expect(reviewPage.usernameInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.username
    );
    await reviewPage.showPasswordCheckbox.check();
    await expect(reviewPage.passwordInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.password
    );
    await expect(reviewPage.verifyPasswordInput).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.password
    );
    await expect(reviewPage.selectHomeLibrary).toHaveValue(
      TEST_CUSTOMIZE_ACCOUNT.homeLibrary
    );
    await expect(reviewPage.acceptTermsCheckbox).toBeChecked();
  });
});

test.describe("mocks API responses on Review page", () => {
  test("displays username available message", async ({ page }) => {
    // mock the API call for username availability
    await mockUsernameApi(page, USERNAME_AVAILABLE_MESSAGE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("AvailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.availableUsernameMessage).toBeVisible();
  });

  test("displays username unavailable error message", async ({ page }) => {
    // mock the API call for username unavailability
    await mockUsernameApi(page, USERNAME_UNAVAILABLE_MESSAGE);

    const reviewPage = new ReviewPage(page);
    await reviewPage.editAccountButton.click();
    await reviewPage.usernameInput.fill("UnavailableUsername");
    await reviewPage.availableUsernameButton.click();
    await expect(reviewPage.unavailableUsernameError).toBeVisible();
  });
});
