import { Page } from "@playwright/test";

export async function mockUsernameApi(page: Page, message: string) {
  await page.route("**/library-card/api/username", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message }),
    });
  });
}

export async function mockCreatePatronApi(
  page: Page,
  name: string,
  barcode: string,
  ptype: number
) {
  await page.route("**/library-card/api/create-patron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name, barcode, ptype }),
    });
  });
}

export async function mockCreateAddress(
  page: Page,
  street: string,
  city: string,
  state: string = "New York",
  postalCode: string
) {
  await page.route("**/library-card/api/address", async (route) => {
    const addressData = {
      line1: street,
      city,
      state,
      zip: postalCode,
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
