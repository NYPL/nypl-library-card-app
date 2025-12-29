import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { fillAddress } from "../utils/form-helper";
import {
  TEST_ADDRESS_OPTIONS,
  TEST_ALTERNATE_ADDRESS,
  TEST_EAST_ADDRESS,
  TEST_HOME_ADDRESS,
  TEST_WEST_ADDRESS,
} from "../utils/constants";

test.describe("displays elements on Address verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/address-verification?newCard=true");
  });
  test("should display the correct headers", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.mainHeader).toBeVisible();
    await expect(addressVerificationPage.stepHeader).toBeVisible();
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
  });

  test("should display the next and previous buttons", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.previousButton).toBeVisible();
    await expect(addressVerificationPage.nextButton).toBeVisible();
  });
});

test.describe("enters home address and alternate address", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/location?newCard=true");
  });

  test("enters valid addresses", async ({ page }) => {
    const addressPage = new AddressPage(page);
    await expect(addressPage.addressHeading).toBeVisible();
    await fillAddress(addressPage, TEST_HOME_ADDRESS);
    await addressPage.nextButton.click();

    const alternateAddressPage = new AlternateAddressPage(page);
    await expect(alternateAddressPage.addressHeading).toBeVisible();
    await fillAddress(alternateAddressPage, TEST_ALTERNATE_ADDRESS);
    await alternateAddressPage.nextButton.click();

    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
    await expect(
      addressVerificationPage.getHomeAddressOption(TEST_HOME_ADDRESS.street)
    ).toBeVisible();
    await expect(addressVerificationPage.alternateAddressHeader).toBeVisible();
    await expect(
      addressVerificationPage.getAlternateAddressOption(
        TEST_ALTERNATE_ADDRESS.street
      )
    ).toBeVisible();
  });

  test("prompts multiple addresses", async ({ page }) => {
    const addressPage = new AddressPage(page);
    const alternateAddressPage = new AlternateAddressPage(page);
    const addressVerificationPage = new AddressVerificationPage(page);

    await test.step("enters home and alternate addresses", async () => {
      await expect(addressPage.addressHeading).toBeVisible();
      await fillAddress(addressPage, TEST_ADDRESS_OPTIONS);
      await addressPage.nextButton.click();

      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await fillAddress(alternateAddressPage, TEST_ADDRESS_OPTIONS);
      await alternateAddressPage.nextButton.click();
    });

    await test.step("displays address options on address verification page", async () => {
      await expect(addressVerificationPage.homeAddressHeader).toBeVisible();
      await expect(
        addressVerificationPage.getHomeAddressOption(TEST_WEST_ADDRESS.street)
      ).toBeVisible();
      await expect(
        addressVerificationPage.alternateAddressHeader
      ).toBeVisible();
      await expect(
        addressVerificationPage.getAlternateAddressOption(
          TEST_EAST_ADDRESS.street
        )
      ).toBeVisible();
    });

    await test.step("selects address options", async () => {
      await addressVerificationPage
        .getHomeAddressOption(TEST_WEST_ADDRESS.street)
        .check();
      await addressVerificationPage
        .getAlternateAddressOption(TEST_EAST_ADDRESS.street)
        .check();
    });

    await test.step("confirms addresses are selected", async () => {
      await expect(
        addressVerificationPage.getHomeAddressOption(TEST_WEST_ADDRESS.street)
      ).toBeChecked();
      await expect(
        addressVerificationPage.getAlternateAddressOption(
          TEST_EAST_ADDRESS.street
        )
      ).toBeChecked();
    });
  });
});
