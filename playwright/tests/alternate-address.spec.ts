import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { LandingPage } from "../pageobjects/landing.page";
import { PersonalPage } from "../pageobjects/personal.page";

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

test("enters alternate address information", async ({ page }) => {
  const alternateAddressPage = new AlternateAddressPage(page);
  await alternateAddressPage.streetAddressInput.fill("476 5th Ave");
  await alternateAddressPage.apartmentSuiteInput.fill("Room 200");
  await alternateAddressPage.cityInput.fill("New York");
  await alternateAddressPage.stateInput.fill("NY");
  await alternateAddressPage.postalCodeInput.fill("10018");
  await alternateAddressPage.nextButton.click();
  await expect(page).toHaveURL(/\/library-card\/address-verification/);
  const addressVerificationPage = new AddressVerificationPage(page);
  await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
});

test("navigates to alternate address page from landing", async ({ page }) => {
  const landingPage = new LandingPage(page);
  await landingPage.getStartedButton.click();
  const personalPage = new PersonalPage(page);
  await personalPage.firstNameInput.fill("Test");
  await personalPage.lastNameInput.fill("User");
  await personalPage.dateOfBirthInput.fill("01/01/1990");
  await personalPage.emailInput.fill("test@example.com");
  await personalPage.nextButton.click();
  const alternateAddressPage = new AlternateAddressPage(page);
  await expect(alternateAddressPage.addressHeading).toBeVisible();
});
