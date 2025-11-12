import { test, expect } from "@playwright/test";

test("displays snapshot of landing page", async ({ page }) => {
  await page.goto("https://qa-www.nypl.org/library-card/new?&newCard=true");
  await expect(page.locator("header").filter({ hasText: "Apply" }))
    .toMatchAriaSnapshot(`
    - banner:
      - heading "Apply for a Library Card Online" [level=1]
  `);
  await expect(page.locator("main")).toMatchAriaSnapshot(`
    - main:
      - separator
      - list:
        - listitem:
          - link "Arabic | العَرَبِية":
            - /url: /library-card/new?lang=ar
        - listitem: ·
        - listitem:
          - link "Bengali | বাঙালি":
            - /url: /library-card/new?lang=bn
        - listitem: ·
        - listitem:
          - link "Chinese (Simplified) | 简体中文":
            - /url: /library-card/new?lang=zhcn
        - listitem: ·
        - listitem:
          - link "English":
            - /url: /library-card/new?lang=en
        - listitem: ·
        - listitem:
          - link "French | Français":
            - /url: /library-card/new?lang=fr
        - listitem: ·
        - listitem:
          - link "Haitian Creole | Kreyòl Ayisyen":
            - /url: /library-card/new?lang=ht
        - listitem: ·
        - listitem:
          - link "Korean | 한국어":
            - /url: /library-card/new?lang=ko
        - listitem: ·
        - listitem:
          - link "Polish | Polski":
            - /url: /library-card/new?lang=pl
        - listitem: ·
        - listitem:
          - link "Russian | Русский":
            - /url: /library-card/new?lang=ru
        - listitem: ·
        - listitem:
          - link "Spanish | Español":
            - /url: /library-card/new?lang=es
        - listitem: ·
        - listitem:
          - link "Urdu | اُردُو":
            - /url: /library-card/new?lang=ur
        - listitem: ·
      - separator
      - heading "Apply for a library card today in a few easy steps" [level=2]
      - text: /If you are \\d+ or older and live, work, attend school, or pay property taxes in New York State, you can apply for a free library card right now using this online application—then visit your nearest NYPL location to validate your information and receive a physical NYPL card\\. If your location within New York State can be confirmed, you will receive a free digital library card right now\\. Visitors from outside of New York State can also use this form to apply for a temporary card that allows them to place holds for physical items\\. This card must be validated in person within \\d+ days, and does not provide access to e-books, databases, or the Culture Pass program\\. Learn more about/
      - link "what you can access":
        - /url: https://www.nypl.org/library-card
      - text: with your library card! By submitting an application, you understand and agree to our
      - link "Cardholder Terms and Conditions":
        - /url: https://nypl.org/help/library-card/terms-conditions
      - text: and agree to our
      - link "Rules and Regulations":
        - /url: https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations
      - text: . To learn more about the Library’s use of personal information, please read our
      - link "Privacy Policy":
        - /url: https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy
      - text: .
      - link "Get started":
        - /url: /library-card/personal?newCard=true
    `);
});
