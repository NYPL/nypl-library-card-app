import { test, expect } from "@playwright/test";
import { AddressVerificationPage } from "../pageobjects/address-verification.page";
import { PageManager } from "../pageobjects/page-manager.page";
import { fillAddress } from "../utils/form-helper";
import {
  SPINNER_TIMEOUT,
  SUPPORTED_LANGUAGES,
  TEST_NYC_ADDRESS,
  TEST_OOS_ADDRESS,
  TEST_MULTIMATCH_ADDRESS,
  TEST_MULTIMATCH_ADDRESS_EAST,
  TEST_MULTIMATCH_ADDRESS_WEST,
} from "../utils/constants";

for (const { lang, name } of SUPPORTED_LANGUAGES) {
  test.describe(`address verification page in ${name} (${lang})`, () => {
    let addressVerificationPage: AddressVerificationPage;
    let pageManager: PageManager;
    let appContent: any;

    test.beforeEach(async ({ page }) => {
      appContent = require(`../../public/locales/${lang}/common.json`);
      addressVerificationPage = new AddressVerificationPage(page, appContent);
      pageManager = new PageManager(page, appContent);
    });

    test.describe("displays elements", () => {
      test("displays headings and buttons", async ({ page }) => {
        await page.goto(
          `/library-card/address-verification?newCard=true&lang=${lang}`
        );
        await expect(addressVerificationPage.mainHeading).toBeVisible();
        await expect(addressVerificationPage.stepHeading).toBeVisible();
        await expect(addressVerificationPage.homeAddressHeading).toBeVisible();
        await expect(addressVerificationPage.previousButton).toBeVisible();
        await expect(addressVerificationPage.nextButton).toBeVisible();
      });
    });

    test.describe("enters home address and alternate address", () => {
      test.beforeEach(async ({ page }) => {
        await page.goto(`/library-card/location?newCard=true&lang=${lang}`);
      });

      test("enters valid addresses", async () => {
        await test.step("enters home address", async () => {
          await expect(pageManager.addressPage.addressHeading).toBeVisible();
          await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
          await pageManager.addressPage.nextButton.click();
          await expect(
            pageManager.addressVerificationPage.spinner
          ).not.toBeVisible({
            timeout: SPINNER_TIMEOUT,
          });
        });

        await test.step("enters alternate address", async () => {
          await expect(
            pageManager.alternateAddressPage.addressHeading
          ).toBeVisible();
          await fillAddress(pageManager.alternateAddressPage, TEST_NYC_ADDRESS);
          await pageManager.alternateAddressPage.nextButton.click();
          await expect(
            pageManager.addressVerificationPage.spinner
          ).not.toBeVisible({
            timeout: SPINNER_TIMEOUT,
          });
        });

        await test.step("displays home and alternate addresses", async () => {
          await expect(
            pageManager.addressVerificationPage.homeAddressHeading
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.getHomeAddressOption(
              TEST_OOS_ADDRESS.street
            )
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.alternateAddressHeading
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.getAlternateAddressOption(
              TEST_NYC_ADDRESS.street
            )
          ).toBeVisible();
        });
      });

      test("prompts multiple address options", async () => {
        await test.step("enters home and alternate addresses", async () => {
          await expect(pageManager.addressPage.addressHeading).toBeVisible();
          await fillAddress(pageManager.addressPage, TEST_MULTIMATCH_ADDRESS);
          await pageManager.addressPage.nextButton.click();
          await expect(
            pageManager.addressVerificationPage.spinner
          ).not.toBeVisible({
            timeout: SPINNER_TIMEOUT,
          });
          await expect(
            pageManager.alternateAddressPage.addressHeading
          ).toBeVisible();
          await fillAddress(
            pageManager.alternateAddressPage,
            TEST_MULTIMATCH_ADDRESS
          );
          await pageManager.alternateAddressPage.nextButton.click();
          await expect(
            pageManager.addressVerificationPage.spinner
          ).not.toBeVisible({
            timeout: SPINNER_TIMEOUT,
          });
        });

        await test.step("displays address options", async () => {
          await expect(
            pageManager.addressVerificationPage.homeAddressHeading
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.getHomeAddressOption(
              TEST_MULTIMATCH_ADDRESS_WEST.street
            )
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.alternateAddressHeading
          ).toBeVisible();
          await expect(
            pageManager.addressVerificationPage.getAlternateAddressOption(
              TEST_MULTIMATCH_ADDRESS_EAST.street
            )
          ).toBeVisible();
        });

        await test.step("selects address options", async () => {
          await pageManager.addressVerificationPage
            .getHomeAddressOption(TEST_MULTIMATCH_ADDRESS_WEST.street)
            .check();
          await pageManager.addressVerificationPage
            .getAlternateAddressOption(TEST_MULTIMATCH_ADDRESS_EAST.street)
            .check();
        });

        await test.step("confirms addresses are selected", async () => {
          await expect(
            pageManager.addressVerificationPage.getHomeAddressOption(
              TEST_MULTIMATCH_ADDRESS_WEST.street
            )
          ).toBeChecked();
          await expect(
            pageManager.addressVerificationPage.getAlternateAddressOption(
              TEST_MULTIMATCH_ADDRESS_EAST.street
            )
          ).toBeChecked();
        });
      });
    });
  });
}
