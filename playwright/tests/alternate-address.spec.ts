import { test, expect } from "@playwright/test";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { TEST_NYC_ADDRESS } from "../utils/constants";
import { fillAddress } from "../utils/form-helper";

test.beforeEach(async ({ page }) => {
  await page.goto("/library-card/workAddress?newCard=true");
});

test.describe("displays elements on Alternate address page", () => {
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

test.describe("enters alternate address", () => {
  test("enters valid alternate address", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    await fillAddress(alternateAddressPage, TEST_NYC_ADDRESS);
    await expect(alternateAddressPage.streetAddressInput).toHaveValue(
      TEST_NYC_ADDRESS.street
    );
    await expect(alternateAddressPage.apartmentSuiteInput).toHaveValue(
      TEST_NYC_ADDRESS.apartmentSuite
    );
    await expect(alternateAddressPage.cityInput).toHaveValue(
      TEST_NYC_ADDRESS.city
    );
    await expect(alternateAddressPage.stateInput).toHaveValue(
      TEST_NYC_ADDRESS.state
    );
    await expect(alternateAddressPage.postalCodeInput).toHaveValue(
      TEST_NYC_ADDRESS.postalCode
    );
  });

  test("enters incomplete alternate address", async ({ page }) => {
    const alternateAddressPage = new AlternateAddressPage(page);
    // await test.step("displays street and city errors", async () => {
    //   await alternateAddressPage.stateInput.click();
    //   await alternateAddressPage.stateInput.selectOption(TEST_NYC_ADDRESS.state);
    //   await alternateAddressPage.postalCodeInput.fill(TEST_NYC_ADDRESS.postalCode);
    //   await alternateAddressPage.nextButton.click();
    //   await expect(alternateAddressPage.streetAddressError).toBeVisible();
    //   await expect(alternateAddressPage.cityError).toBeVisible();
    // });

    // await test.step("displays state and postal code errors", async () => {
    //   await alternateAddressPage.streetAddressInput.fill(TEST_NYC_ADDRESS.street);
    //   await alternateAddressPage.cityInput.fill(TEST_NYC_ADDRESS.city);
    //   await alternateAddressPage.nextButton.click();
    //   await expect(alternateAddressPage.stateError).toBeVisible();
    //   await expect(alternateAddressPage.postalCodeError).toBeVisible();
    // });

    // test.step("displays city, state, and postal code errors", async () => {
    await alternateAddressPage.streetAddressInput.fill(TEST_NYC_ADDRESS.street);
    await alternateAddressPage.nextButton.click();
    await expect(alternateAddressPage.cityError).toBeVisible();
    await expect(alternateAddressPage.stateError).toBeVisible();
    await expect(alternateAddressPage.postalCodeError).toBeVisible();
    // });
  });
});
