export async function mockUsernameApi(page, message: string) {
  await page.route("**/library-card/api/username", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ message }),
    });
  });
}
