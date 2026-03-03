import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillAccountInfo,
  fillAddress,
  fillPersonalInfo,
} from "../utils/form-helper";
import {
  PAGE_ROUTES,
  SPINNER_TIMEOUT,
  TEST_ACCOUNT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_PATRON,
} from "../utils/constants";

test.describe("E2E: Navigate backward in application", () => {
  test("navigates backward to landing without entering info", async ({
    page,
  }) => {
    const pageManager = new PageManager(page);

    await test.step("begins on account page", async () => {
      await page.goto(PAGE_ROUTES.ACCOUNT);
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await pageManager.accountPage.previousButton.click();
    });

    await test.step("navigates back to address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await expect(
        pageManager.addressVerificationPage.previousButton
      ).toBeVisible();
      await pageManager.addressVerificationPage.previousButton.click();
    });

    await test.step("navigates back to address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await expect(pageManager.addressPage.previousButton).toBeVisible();
      await pageManager.addressPage.previousButton.click();
    });

    await test.step("navigates back to personal information page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await expect(pageManager.personalPage.previousButton).toBeVisible();
      await pageManager.personalPage.previousButton.click();
    });

    await test.step("navigates back to landing page", async () => {
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
    });
  });

  test("retains user-entered info when navigating backward", async ({
    page,
  }) => {
    const pageManager = new PageManager(page);

    await test.step("enters personal information", async () => {
      await page.goto(PAGE_ROUTES.PERSONAL);
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage, TEST_PATRON);
      await pageManager.personalPage.receiveInfoCheckbox.click(); // unchecks
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
      await pageManager.alternateAddressPage.nextButton.click();
      await expect(pageManager.alternateAddressPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("confirms address verification", async () => {
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
      await expect(pageManager.addressVerificationPage.spinner).not.toBeVisible(
        { timeout: SPINNER_TIMEOUT }
      );
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage, TEST_ACCOUNT);
      await pageManager.accountPage.nextButton.click();
    });

    await test.step("displays review page and navigates back to account page", async () => {
      await expect(pageManager.reviewPage.stepHeading).toBeVisible();
      await page.goBack();
    });

    await test.step("retains info on account page", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await expect(pageManager.accountPage.usernameInput).toHaveValue(
        TEST_ACCOUNT.username
      );
      await expect(pageManager.accountPage.passwordInput).toHaveValue(
        TEST_ACCOUNT.password
      );
      await expect(pageManager.accountPage.verifyPasswordInput).toHaveValue(
        TEST_ACCOUNT.password
      );
      await expect(pageManager.accountPage.selectHomeLibrary).toHaveValue(
        TEST_ACCOUNT.homeLibraryCode
      );
      await expect(pageManager.accountPage.acceptTermsCheckbox).toBeChecked();
      await pageManager.accountPage.previousButton.click();
    });

    await test.step("retains info on address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeading
      ).toBeVisible();
      await expect(
        pageManager.addressVerificationPage.getHomeAddressOption(
          TEST_OOS_ADDRESS.street
        )
      ).toBeChecked();
      await expect(
        pageManager.addressVerificationPage.getAlternateAddressOption(
          TEST_NYC_ADDRESS.street
        )
      ).toBeChecked();
      await pageManager.addressVerificationPage.previousButton.click();
    });

    await test.step("retains info on address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await expect(pageManager.addressPage.streetAddressInput).toHaveValue(
        TEST_OOS_ADDRESS.street
      );
      await expect(pageManager.addressPage.apartmentSuiteInput).toHaveValue(
        TEST_OOS_ADDRESS.apartmentSuite
      );
      await expect(pageManager.addressPage.cityInput).toHaveValue(
        TEST_OOS_ADDRESS.city
      );
      await expect(pageManager.addressPage.stateInput).toHaveValue(
        TEST_OOS_ADDRESS.state
      );
      await expect(pageManager.addressPage.postalCodeInput).toHaveValue(
        TEST_OOS_ADDRESS.postalCode
      );
      await pageManager.addressPage.previousButton.click();
    });

    await test.step("retains info on personal information page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await expect(pageManager.personalPage.firstNameInput).toHaveValue(
        TEST_PATRON.firstName
      );
      await expect(pageManager.personalPage.lastNameInput).toHaveValue(
        TEST_PATRON.lastName
      );
      await expect(pageManager.personalPage.dateOfBirthInput).toHaveValue(
        TEST_PATRON.dateOfBirth
      );
      await expect(pageManager.personalPage.emailInput).toHaveValue(
        TEST_PATRON.email
      );
      await expect(
        pageManager.personalPage.receiveInfoCheckbox
      ).not.toBeChecked();
    });
  });
});
