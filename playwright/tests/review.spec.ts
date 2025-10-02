import { test, expect } from "@playwright/test";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { AccountPage } from "../pageobjects/account.page";
import { ReviewPage } from "../pageobjects/review.page";
import { TEST_PATRON_INFO } from "../utils/constants";
import {
  fillPersonalInfo,
  fillHomeAddress,
  fillAlternateAddress,
} from "../utils/form-helper";

test.describe("displays elements on Confirm Your Information page", () => {
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

test.describe("enters patron information and addresses flow", () => {
  test("displays patron information", async ({ page }) => {
    test.setTimeout(60000);
    await page.goto("/library-card/personal?newCard=true");
    const personalPage = new PersonalPage(page);
    await fillPersonalInfo(personalPage);
    personalPage.nextButton.click();

    const addressPage = new AddressPage(page);
    await expect(addressPage.addressHeading).toBeVisible();
    await fillHomeAddress(addressPage);
    addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.stepHeading).toBeVisible();
    await fillAlternateAddress(alternateAddressPage);
    alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.stepHeader).toBeVisible();
    addressVerificationPage.nextButton.click();

    const accountPage = new AccountPage(page);
    await expect(accountPage.stepHeading).toBeVisible();
    await accountPage.usernameInput.fill("TestUser10225");
    await accountPage.passwordInput.fill("TestPassword123!");
    await accountPage.verifyPasswordInput.fill("TestPassword123!");
    await accountPage.acceptTermsCheckbox.check();
    accountPage.nextButton.click();

    const reviewPage = new ReviewPage(page);
    await expect(reviewPage.firstNameValue).toBeVisible();
    await expect(reviewPage.lastNameValue).toBeVisible();
    await expect(reviewPage.dateOfBirthValue).toBeVisible();
    await expect(reviewPage.emailValue).toBeVisible();
    await expect(reviewPage.receiveInfoChoice).toBeVisible();
  });
});
