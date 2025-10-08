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

test.describe("verifies patron information on review page", () => {
  test("displays patron information on review page", async ({ page }) => {
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

    // await test.step("displays Address on review page", async () => {});

    // await test.step("displays Alternate Address on review page", async () => {});

    // await test.step("displays Create Your Account on review page", async () => {});
  });
});

// test.describe: submits application
// test: displays static elements on success page
// test: displays variable elements on success page (e.g., member name, current date)

// test.describe: navigates from get started page to success page
// test: confirms user exists in Sierra database
// test: deletes user from Sierra database

// test.describe: navigates back to previous pages from account page
