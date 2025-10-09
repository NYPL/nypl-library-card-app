import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { AccountPage } from "../pageobjects/account.page";
import { ReviewPage } from "../pageobjects/review.page";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
} from "../utils/form-helper";
import { TEST_PATRON_INFO } from "../utils/constants";

test.describe("displays elements on review page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/review?newCard=true");
  });

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
});

test.describe("verifies patron information on review page", () => {
  test("displays Personal Information entered", async ({ page }) => {
    await test.step("enters personal information", async () => {
      await page.goto("/library-card/personal?newCard=true");
      const personalPage = new PersonalPage(page);
      await fillPersonalInfo(personalPage);
      await personalPage.nextButton.click();
    });

    await test.step("enters home address", async () => {
      const addressPage = new AddressPage(page);
      await expect(addressPage.addressHeading).toBeVisible();
      await fillHomeAddress(addressPage);
      await addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      const alternateAddressPage = new AlternateAddressPage(page);
      await expect(alternateAddressPage.stepHeading).toBeVisible();
      await fillAlternateAddress(alternateAddressPage);
      await alternateAddressPage.nextButton.click();
    });

    await test.step("confirms address verification", async () => {
      const addressVerificationPage = new AddressVerificationPage(page);
      await expect(addressVerificationPage.stepHeader).toBeVisible();
      await addressVerificationPage.nextButton.click();
    });

    await test.step("enters account information", async () => {
      const accountPage = new AccountPage(page);
      await expect(accountPage.stepHeading).toBeVisible();
      await accountPage.usernameInput.fill("User10225");
      await accountPage.passwordInput.fill("Password123!");
      await accountPage.verifyPasswordInput.fill("Password123!");
      await accountPage.acceptTermsCheckbox.check();
      await accountPage.nextButton.click();
    });

    await test.step("displays Personal Information on review page", async () => {
      const reviewPage = new ReviewPage(page);
      await expect(reviewPage.firstNameValue).toHaveText(
        TEST_PATRON_INFO.firstName
      );
      await expect(reviewPage.lastNameValue).toHaveText(
        TEST_PATRON_INFO.lastName
      );
      await expect(reviewPage.dateOfBirthValue).toHaveText(
        TEST_PATRON_INFO.dateOfBirth
      );
      await expect(reviewPage.emailValue).toHaveText(TEST_PATRON_INFO.email);
      await expect(reviewPage.receiveInfoChoice).toHaveText("Yes");
    });
  });
});

test.describe("edits patron information on review page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/review?newCard=true");
  });

  test("displays editable Personal Information section", async ({ page }) => {
    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.editPersonalInfoButton).toBeVisible();
    await reviewPage.editPersonalInfoButton.click();
    await expect(reviewPage.firstNameInput).toBeVisible();
    await expect(reviewPage.lastNameInput).toBeVisible();
    await expect(reviewPage.dateOfBirthInput).toBeVisible();
    await expect(reviewPage.emailInput).toBeVisible();
    await expect(reviewPage.receiveInfoCheckbox).toBeVisible();
  });

  // does not replace patron info since there's no existing text
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
