import { test, expect } from "@playwright/test";
// import { fillPersonalInfo } from "../utils/form-helper";
// import { PersonalPage } from "../pageobjects/personal.page";

const HEADER_SNAPSHOT = `
  - banner:
    - heading "Apply for a Library Card Online" [level=1]
`;

test.describe("ARIA snapshot tests", () => {
  test("displays snapshot of landing page", async ({ page }) => {
    await page.goto("https://qa-www.nypl.org/library-card/new?&newCard=true");
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - separator
        - list:
          - listitem:
            - link "Arabic | العَرَبِية":
              - /url: /library-card/new?lang=ar
          - listitem:
            - link "Bengali | বাঙালি":
              - /url: /library-card/new?lang=bn
          - listitem:
            - link "Chinese (Simplified) | 简体中文":
              - /url: /library-card/new?lang=zhcn
          - listitem:
            - link "English":
              - /url: /library-card/new?lang=en
          - listitem:
            - link "French | Français":
              - /url: /library-card/new?lang=fr
          - listitem:
            - link "Haitian Creole | Kreyòl Ayisyen":
              - /url: /library-card/new?lang=ht
          - listitem:
            - link "Korean | 한국어":
              - /url: /library-card/new?lang=ko
          - listitem:
            - link "Polish | Polski":
              - /url: /library-card/new?lang=pl
          - listitem:
            - link "Russian | Русский":
              - /url: /library-card/new?lang=ru
          - listitem:
            - link "Spanish | Español":
              - /url: /library-card/new?lang=es
          - listitem:
            - link "Urdu | اُردُو":
              - /url: /library-card/new?lang=ur
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
        - separator
      `);
  });

  test("displays snapshot of personal page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/personal?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - 'heading "Step 1 of 5: Personal information" [level=2]'
        - text: Form fields must be filled out using only Latin characters. First name (required)
        - textbox "First name (required)"
        - text: Last name (required)
        - textbox "Last name (required)"
        - text: Date of birth (required)
        - textbox "Date of birth (required)"
        - text: MM/DD/YYYY, including slashes Email address (required)
        - textbox "Email address (required)"
        - text: An email address is required to use many of our digital resources, such as e-books. If you do not wish to provide an email address, you can apply for a physical card using our
        - link "alternate form":
          - /url: https://on.nypl.org/internationalresearch
        - text: . Once filled out, please visit one of our
        - link "locations":
          - /url: https://www.nypl.org/locations
        - text: with proof of identity and home address to pick up your card.
        - checkbox "Yes, I would like to receive information about NYPL's programs and services" [checked]
        - text: Yes, I would like to receive information about NYPL's programs and services
        - link "Previous":
          - /url: /library-card/new?&newCard=true
        - button "Next"
      `);
  });

  test("displays snapshot of address page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/location?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - 'heading "Step 2 of 5: Address" [level=2]'
        - text: Form fields must be filled out using only Latin characters.
        - heading "Home address" [level=3]
        - text: If you live in NYC, please fill out the home address form. Street address (required)
        - textbox "Street address (required)"
        - text: Apartment / Suite
        - textbox "Apartment / Suite"
        - text: City (required)
        - textbox "City (required)"
        - text: State (required)
        - textbox "State (required)"
        - text: 2-letter abbreviation Postal code (required)
        - textbox "Postal code (required)"
        - text: 5 or 9-digit postal code
        - link "Previous":
          - /url: /library-card/personal?&newCard=true
        - button "Next"
      `);
  });

  test("displays snapshot of alternate address page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/workAddress?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - heading "Alternate address" [level=2]
        - text: The application process is slightly different depending on whether you live, work, go to school, or pay property taxes in New York City, elsewhere in New York State, or elsewhere in the United States and you're just visiting New York City. Please select one of the following and fill out the required fields. Form fields must be filled out using only Latin characters.
        - heading "Alternate address" [level=3]
        - text: If you work or go to school in NYC please provide the address. Street address
        - textbox "Street address"
        - text: Apartment / Suite
        - textbox "Apartment / Suite"
        - text: City
        - textbox "City"
        - text: State
        - textbox "State"
        - text: 2-letter abbreviation Postal code
        - textbox "Postal code"
        - text: 5 or 9-digit postal code
        - link "Previous":
          - /url: /library-card/location?&newCard=true
        - button "Next"
      `);
  });

  // partial snapshot does not display alternate address heading or options
  test("displays snapshot of address verification page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/address-verification?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - 'heading "Step 3 of 5: Address verification" [level=2]'
        - text: Please select the correct address.
        - heading "Home address" [level=3]
        - link "Previous":
          - /url: /library-card/location?&newCard=true
        - button "Next"
      `);
  });

  test("displays snapshot of review page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/review?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - 'heading "Step 5 of 5: Confirm your information" [level=2]'
        - text: Make sure all the information you’ve entered is correct. If needed, you can still make changes before you submit your application. Form fields must be filled out using only Latin characters.
        - heading "Personal information" [level=3]
        - text: First name Last name Date of birth Email address Receive information about NYPL's programs and services Yes
        - button "Edit Personal information"
        - heading "Address" [level=3]
        - text: Street address City State Postal code
        - button "Edit Address"
        - heading "Create your account" [level=3]
        - text: Username Password
        - checkbox "Show password"
        - text: Show password Home library E-Branch
        - button "Edit Create your account"
        - text: After you submit your application, you will see a confirmation page with your account information, and you will be able to log in and request books and materials.
        - button "Submit"
      `);
  });

  test("displays snapshot of congrats page", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/congrats?&newCard=true"
    );
    await expect(
      page.locator("header").filter({ hasText: "Apply" })
    ).toMatchAriaSnapshot(HEADER_SNAPSHOT);
    await expect(page.locator("main")).toMatchAriaSnapshot(`
      - main:
        - heading "Congratulations! You now have a digital New York Public Library card." [level=2]
        - img "NYPL Library Barcode Background"
        - text: MEMBER NAME
        - img "Scannable barcode"
        - text: /ISSUED \\d+\\/\\d+\\/\\d+ Print or save this information for your records\\. Within \\d+ hours, you will receive an email with the details of your account\\. To borrow physical materials, please visit one of our/
        - link "locations":
          - /url: http://nypl.org/locations
        - text: with a valid
        - link "photo ID and proof of address":
          - /url: https://www.nypl.org/help/library-card/terms-conditions#Eligibility
        - text: /to complete the application for a physical card\\. This is a temporary card and will expire in \\d+ days\\. If you are a student in a New York–accredited college, an employee at a NYC company but not physically in the city or state, or a researcher who will be visiting one of our research centers, contact/
        - link "gethelp@nypl.org":
          - /url: mailto:gethelp@nypl.org
        - text: to update your card.
        - heading "Get started with The New York Public Library" [level=2]
        - text: Borrow books & more
        - link "Log into your account":
          - /url: https://dev-login.nypl.org/auth/login?redirect_uri=https%3A%2F%2Fborrow.nypl.org%2F%3FopenAccount%3Dprofile
        - text: and browse the catalog. Get updates
        - link "Find out about all the Library has to offer.":
          - /url: https://www.nypl.org/enews
        - text: Learn more
        - link "Discover everything you can do with your library card.":
          - /url: https://www.nypl.org/discover-library-card
      `);
  });
});

test.describe("visual screenshot tests", () => {
  test("matches landing page screenshot", async ({ page }) => {
    await page.goto("https://qa-www.nypl.org/library-card/new?&newCard=true");
    await expect(page).toHaveScreenshot();
  });

  test("matches personal info page screenshot", async ({ page }) => {
    await page.goto(
      "https://qa-www.nypl.org/library-card/personal?&newCard=true"
    );
    // await fillPersonalInfo(new PersonalPage(page)); // will fail screenshot assertion
    await expect(page).toHaveScreenshot();
  });
});
