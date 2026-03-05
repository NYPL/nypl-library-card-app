import { Page } from "@playwright/test";

export async function mockUsernameApi(
  page: Page,
  availability: "available" | "unavailable"
) {
  const usernameResponse = {
    available: {
      status: 200,
      message: "This username is available.",
    },
    unavailable: {
      status: 409,
      message: "This username is unavailable. Please try another.",
    },
  };

  await page.route("**/library-card/api/username", async (route) => {
    const { status, message } = usernameResponse[availability];
    await route.fulfill({
      status,
      contentType: "application/json",
      body: JSON.stringify({ message }),
    });
  });
}

export async function mockCreatePatronApi(
  page: Page,
  name: string,
  barcode: string
) {
  await page.route("**/library-card/api/create-patron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ name, barcode }),
    });
  });
}
