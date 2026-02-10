import { Page, Locator } from "@playwright/test";

export class PersonalPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly firstNameInput: Locator;
  readonly firstNameError: Locator;
  readonly lastNameInput: Locator;
  readonly lastNameError: Locator;
  readonly dateOfBirthInput: Locator;
  readonly dateOfBirthError: Locator;
  readonly emailInput: Locator;
  readonly emailError: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;
  readonly receiveInfoCheckbox: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;

  constructor(page: Page, appContent?: any) {
    this.page = page;
    this.mainHeading = this.page.getByRole("heading", {
      name: appContent?.banner?.title || "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = this.page.getByRole("heading", {
      name: appContent?.personal?.title || "Step 1 of 5: Personal information",
      level: 2,
    });
    this.firstNameInput = this.page.getByLabel(
      appContent?.personal?.firstName.label || "First name"
    );
    this.firstNameError = this.page.getByText(
      appContent?.personal?.errorMessage?.firstName ||
        "There was a problem. Please enter a valid first name."
    );
    this.lastNameInput = this.page.getByLabel(
      appContent?.personal?.lastName.label || "Last name"
    );
    this.lastNameError = this.page.getByText(
      appContent?.personal?.errorMessage?.lastName ||
        "There was a problem. Please enter a valid last name."
    );
    this.dateOfBirthInput = this.page.getByLabel(
      appContent?.personal?.birthdate.label || "Date of birth"
    );
    this.dateOfBirthError = this.page.getByText(
      appContent?.personal?.errorMessage?.birthdate ||
        "There was a problem. Please enter a valid date, MM/DD/YYYY, including slashes."
    );
    this.emailInput = this.page.getByLabel(
      appContent?.personal?.email.label || "Email"
    );
    this.emailError = this.page.getByText(
      appContent?.personal?.errorMessage?.email ||
        "There was a problem. Please enter a valid email address."
    );
    this.alternateFormLink = this.page.getByRole("link", {
      name: appContent?.personal?.email?.alternateForm || "alternate form",
    });
    this.locationsLink = this.page.locator("#mainContent").getByRole("link", {
      name: appContent?.personal?.email?.locations || "locations",
    });
    this.receiveInfoCheckbox = this.page.getByText(
      appContent?.personal?.eCommunications?.labelText ||
        "Yes, I would like to receive information about NYPL's programs and services"
    );
    this.previousButton = this.page.getByRole("link", {
      name: appContent?.button?.previous || "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: appContent?.button?.next || "Next",
      exact: true,
    });
  }
}
