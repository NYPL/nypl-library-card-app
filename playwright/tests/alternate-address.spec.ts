import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { LandingPage } from "../pageobjects/landing.page";
import { PersonalPage } from "../pageobjects/personal.page";
import { AddressPage } from "../pageobjects/address.page";

test.describe("displays elements on Alternate Address page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/workAddress?newCard=true");
  });

  test("displays all headings", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.mainHeading).toBeVisible();
    await expect(alternateAddressPage.stepHeading).toBeVisible();
    await expect(alternateAddressPage.addressHeading).toBeVisible();
  });

  test("displays alternate address form", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.streetAddressInput).toBeVisible();
    await expect(alternateAddressPage.apartmentSuiteInput).toBeVisible();
    await expect(alternateAddressPage.cityInput).toBeVisible();
    await expect(alternateAddressPage.stateInput).toBeVisible();
    await expect(alternateAddressPage.postalCodeInput).toBeVisible();
  });

  test("displays next and previous buttons", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.nextButton).toBeVisible();
    await expect(alternateAddressPage.previousButton).toBeVisible();
  });
});

test.describe(
  "navigates through the application flow to Alternate Address page",
  () => {
    test("navigates to Alternate Address page from landing", async ({
      page,
    }) => {
      await page.goto("/library-card/new");
      const landingPage = new LandingPage(page);
      await expect(landingPage.mainHeading).toBeVisible();
      await landingPage.getStartedButton.click();

      const personalPage = new PersonalPage(page);
      await expect(personalPage.stepHeading).toBeVisible();
      await personalPage.firstNameInput.fill("Test");
      await personalPage.lastNameInput.fill("User");
      await personalPage.dateOfBirthInput.fill("01/01/1990");
      await personalPage.emailInput.fill("test@example.com");
      await personalPage.nextButton.click();

      const addressPage = new AddressPage(page);
      await expect(addressPage.addressHeading).toBeVisible();
      await addressPage.streetAddressInput.fill("123 Main St");
      await addressPage.cityInput.fill("New York");
      await addressPage.stateInput.fill("NY");
      await addressPage.postalCodeInput.fill("10001");
      await addressPage.nextButton.click();

      const alternateAddressPage = new AlternateAddressPage(page);
      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
      await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
      await alternateAddressPage.cityInput.fill("New York");
      await alternateAddressPage.stateInput.fill("NY");
      await alternateAddressPage.postalCodeInput.fill("10018");
      await alternateAddressPage.nextButton.click();

      const addressVerificationPage = new AddressVerificationPage(page);
      await expect(
        addressVerificationPage.alternateAddressHeader
      ).toBeVisible();
    });

    test("navigates to Alternate Address page from Personal page", async ({
      page,
    }) => {
      await page.goto("/library-card/personal?newCard=true");
      const personalPage = new PersonalPage(page);
      await expect(personalPage.stepHeading).toBeVisible();
      await personalPage.firstNameInput.fill("Test");
      await personalPage.lastNameInput.fill("User");
      await personalPage.dateOfBirthInput.fill("01/01/1990");
      await personalPage.emailInput.fill("test@example.com");
      await personalPage.nextButton.click();

      const addressPage = new AddressPage(page);
      await expect(addressPage.addressHeading).toBeVisible();
      await addressPage.streetAddressInput.fill("123 Main St");
      await addressPage.cityInput.fill("New York");
      await addressPage.stateInput.fill("NY");
      await addressPage.postalCodeInput.fill("10001");
      await addressPage.nextButton.click();

      const alternateAddressPage = new AlternateAddressPage(page);
      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
      await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
      await alternateAddressPage.cityInput.fill("New York");
      await alternateAddressPage.stateInput.fill("NY");
      await alternateAddressPage.postalCodeInput.fill("10018");
      await alternateAddressPage.nextButton.click();

      const addressVerificationPage = new AddressVerificationPage(page);
      await expect(
        addressVerificationPage.alternateAddressHeader
      ).toBeVisible();
    });

    test("navigates to Alternate Address page from Home Address page", async ({
      page,
    }) => {
      await page.goto("/library-card/location?newCard=true");
      const addressPage = new AddressPage(page);
      await expect(addressPage.addressHeading).toBeVisible();
      await addressPage.streetAddressInput.fill("123 Main St");
      await addressPage.cityInput.fill("New York");
      await addressPage.stateInput.fill("NY");
      await addressPage.postalCodeInput.fill("10001");
      await addressPage.nextButton.click();

      const alternateAddressPage = new AlternateAddressPage(page);
      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
      await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
      await alternateAddressPage.cityInput.fill("New York");
      await alternateAddressPage.stateInput.fill("NY");
      await alternateAddressPage.postalCodeInput.fill("10018");
      await alternateAddressPage.nextButton.click();

      const addressVerificationPage = new AddressVerificationPage(page);
      await expect(
        addressVerificationPage.alternateAddressHeader
      ).toBeVisible();
    });
  }
);
