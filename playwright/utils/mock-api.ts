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
  ptype: number = 7 // defaults to temporary patron type // NEED?
) {
  await page.route("**/library-card/api/create-patron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name, barcode, ptype }),
    });
  });
}
