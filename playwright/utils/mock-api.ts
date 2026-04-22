import { Page } from "@playwright/test";
import { PATRON_TYPES } from "./constants";
import { AddressData } from "./types";

export const UNAVAILABLE_RESPONSE = {
  status: 400,
  type: "unavailable-username",
  title: "Bad Username",
  detail: "This username is unavailable. Please try another.",
  name: "Bad Username",
  message: "This username is unavailable. Please try another.",
};

export async function mockUsernameApi(page: Page, isAvailable: boolean = true) {
  await page.route("**/library-card/api/username", async (route) => {
    const body = isAvailable ? { message: "Success" } : UNAVAILABLE_RESPONSE;
    await route.fulfill({
      status: isAvailable ? 200 : 400,
      contentType: "application/json",
      body: JSON.stringify(body),
    });
  });
}

export async function mockCreatePatronApi(
  page: Page,
  name: string,
  barcode: string,
  ptype: number = PATRON_TYPES.DIGITAL_TEMPORARY
) {
  await page.route("**/library-card/api/create-patron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name, barcode, ptype }),
    });
  });
}

export async function mockCreateAddress(page: Page, address: AddressData) {
  await page.route("**/library-card/api/address", async (route) => {
    const addressData = {
      line1: address.street,
      city: address.city,
      state: address.state,
      zip: address.postalCode,
      hasBeenValidated: true,
    };

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        address: addressData,
        addresses: [],
        success: true,
      }),
    });
  });
}
