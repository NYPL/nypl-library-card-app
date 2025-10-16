export async function mockUsernameApi(page, message: string) {
  await page.route("**/library-card/api/username", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message }),
    });
  });
}

export async function mockCreatePatronApi(page) {
  await page.route("**/library-card/api/create-patron", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ names: "Test User", barcodes: "12341234123412" }),
    });
  });
}
