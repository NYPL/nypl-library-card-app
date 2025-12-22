import { test, expect } from "@playwright/test";
import { PageManager } from "../pageobjects/page-manager.page";
import {
  fillAccountInfo,
  fillAlternateAddress,
  fillHomeAddress,
  fillPersonalInfo,
} from "../utils/form-helper";
import { TEST_HOME_ADDRESS, TEST_PATRON_INFO } from "../utils/constants";

test.describe("E2E: Navigate backward in application", () => {
  test("navigates backward to landing without entering info", async ({
    page,
  }) => {
    const pageManager = new PageManager(page);

    await test.step("begins at account page", async () => {
      await page.goto("/library-card/account?newCard=true");
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await expect(pageManager.accountPage.previousButton).toBeVisible();
      await pageManager.accountPage.previousButton.click();
    });

    await test.step("displays address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await expect(
        pageManager.addressVerificationPage.previousButton
      ).toBeVisible();
      await pageManager.addressVerificationPage.previousButton.click();
    });

    await test.step("displays address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await expect(pageManager.addressPage.previousButton).toBeVisible();
      await pageManager.addressPage.previousButton.click();
    });

    await test.step("displays personal information page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await expect(pageManager.personalPage.previousButton).toBeVisible();
      await pageManager.personalPage.previousButton.click();
    });

    await test.step("displays landing page", async () => {
      await expect(pageManager.landingPage.applyHeading).toBeVisible();
    });
  });

  test("navigates backward after entering info", async ({ page }) => {
    const pageManager = new PageManager(page);

    await test.step("enters personal information", async () => {
      await page.goto("/library-card/personal?&newCard=true");
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await fillPersonalInfo(pageManager.personalPage);
      await pageManager.personalPage.receiveInfoCheckbox.click();
      await pageManager.personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await fillHomeAddress(pageManager.addressPage);
      await pageManager.addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(pageManager.alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(pageManager.alternateAddressPage);
      await pageManager.alternateAddressPage.nextButton.click();
    });

    await test.step("confirms address verification", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await pageManager.addressVerificationPage.homeAddressOption.check();
      await pageManager.addressVerificationPage.alternateAddressOption.check();
      await pageManager.addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      await expect(pageManager.accountPage.stepHeading).toBeVisible();
      await fillAccountInfo(pageManager.accountPage); // unable to confirm this remains filled out
      await pageManager.accountPage.previousButton.click();
    });

    await test.step("displays address verification page", async () => {
      await expect(
        pageManager.addressVerificationPage.stepHeader
      ).toBeVisible();
      await expect(
        pageManager.addressVerificationPage.homeAddressOption
      ).toBeChecked();
      await expect(
        pageManager.addressVerificationPage.alternateAddressOption
      ).toBeChecked();
      await pageManager.addressVerificationPage.previousButton.click();
    });

    await test.step("displays address page", async () => {
      await expect(pageManager.addressPage.stepHeading).toBeVisible();
      await expect(pageManager.addressPage.streetAddressInput).toHaveValue(
        TEST_HOME_ADDRESS.street
      );
      await expect(pageManager.addressPage.cityInput).toHaveValue(
        TEST_HOME_ADDRESS.city
      );
      await expect(pageManager.addressPage.stateInput).toHaveValue(
        TEST_HOME_ADDRESS.state
      );
      await expect(pageManager.addressPage.postalCodeInput).toHaveValue(
        TEST_HOME_ADDRESS.postalCode
      );
      await pageManager.addressPage.previousButton.click();
    });

    await test.step("displays personal information page", async () => {
      await expect(pageManager.personalPage.stepHeading).toBeVisible();
      await expect(pageManager.personalPage.firstNameInput).toHaveValue(
        TEST_PATRON_INFO.firstName
      );
      await expect(pageManager.personalPage.lastNameInput).toHaveValue(
        TEST_PATRON_INFO.lastName
      );
      await expect(pageManager.personalPage.emailInput).toHaveValue(
        TEST_PATRON_INFO.email
      );
      await expect(pageManager.personalPage.dateOfBirthInput).toHaveValue(
        TEST_PATRON_INFO.dateOfBirth
      );
      await expect(
        pageManager.personalPage.receiveInfoCheckbox
      ).not.toBeChecked();
      await pageManager.personalPage.previousButton.click();
    });
  });
});
