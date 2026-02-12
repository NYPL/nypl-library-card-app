import { test, expect } from "@playwright/test";
import { AddressPage } from "../pageobjects/address.page";
import { AlternateAddressPage } from "../pageobjects/alternate-address.page";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { fillAddress } from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_MULTIMATCH_ADDRESS,
  TEST_MULTIMATCH_ADDRESS_EAST,
  TEST_MULTIMATCH_ADDRESS_WEST,
} from "../utils/constants";

test.describe("displays elements on address verification page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/library-card/address-verification?newCard=true");
  });
  test("displays headings", async ({ page }) => {
    const addressVerificationPage = new AddressVerificationPage(page);
    await expect(addressVerificationPage.mainHeading).toBeVisible();
    await expect(addressVerificationPage.stepHeading).toBeVisible();
    await expect(addressVerificationPage.homeAddressHeading).toBeVisible();
  });

  test("displays next and previous buttons", async ({ page }) => {
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
    const alternateAddressPage = new AlternateAddressPage(page);
    const addressVerificationPage = new AddressVerificationPage(page);

    await test.step("enters home address", async () => {
      await expect(addressPage.addressHeading).toBeVisible();
      await fillAddress(addressPage, TEST_OOS_ADDRESS);
      await addressPage.nextButton.click();
    });

    await test.step("enters alternate address", async () => {
      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await fillAddress(alternateAddressPage, TEST_NYC_ADDRESS);
      await alternateAddressPage.nextButton.click();
    });

    await test.step("displays home and alternate addresses", async () => {
      await expect(addressVerificationPage.homeAddressHeading).toBeVisible();
      await expect(
        addressVerificationPage.getHomeAddressOption(TEST_OOS_ADDRESS.street)
      ).toBeVisible();
      await expect(
        addressVerificationPage.alternateAddressHeading
      ).toBeVisible();
      await expect(
        addressVerificationPage.getAlternateAddressOption(
          TEST_NYC_ADDRESS.street
        )
      ).toBeVisible();
    });
  });

  test("prompts multiple address options", async ({ page }) => {
    const addressPage = new AddressPage(page);
    const alternateAddressPage = new AlternateAddressPage(page);
    const addressVerificationPage = new AddressVerificationPage(page);

    await test.step("enters home and alternate addresses", async () => {
      await expect(addressPage.addressHeading).toBeVisible();
      await fillAddress(addressPage, TEST_MULTIMATCH_ADDRESS);
      await addressPage.nextButton.click();
      await expect(addressVerificationPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });

      await expect(alternateAddressPage.addressHeading).toBeVisible();
      await fillAddress(alternateAddressPage, TEST_MULTIMATCH_ADDRESS);
      await alternateAddressPage.nextButton.click();
      await expect(addressVerificationPage.spinner).not.toBeVisible({
        timeout: SPINNER_TIMEOUT,
      });
    });

    await test.step("displays address options", async () => {
      await expect(addressVerificationPage.homeAddressHeading).toBeVisible();
      await expect(
        addressVerificationPage.getHomeAddressOption(
          TEST_MULTIMATCH_ADDRESS_WEST.street
        )
      ).toBeVisible();
      await expect(
        addressVerificationPage.alternateAddressHeading
      ).toBeVisible();
      await expect(
        addressVerificationPage.getAlternateAddressOption(
          TEST_MULTIMATCH_ADDRESS_EAST.street
        )
      ).toBeVisible();
    });

    await test.step("selects address options", async () => {
      await addressVerificationPage
        .getHomeAddressOption(TEST_MULTIMATCH_ADDRESS_WEST.street)
        .check();
      await addressVerificationPage
        .getAlternateAddressOption(TEST_MULTIMATCH_ADDRESS_EAST.street)
        .check();
    });

    await test.step("confirms addresses are selected", async () => {
      await expect(
        addressVerificationPage.getHomeAddressOption(
          TEST_MULTIMATCH_ADDRESS_WEST.street
        )
      ).toBeChecked();
      await expect(
        addressVerificationPage.getAlternateAddressOption(
          TEST_MULTIMATCH_ADDRESS_EAST.street
        )
      ).toBeChecked();
    });
  });
});
