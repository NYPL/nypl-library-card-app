import { Page, Locator } from "@playwright/test";

export class PersonalPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly checkBox: Locator;
  readonly previousButton: Locator;
  readonly nextButton: Locator;
  readonly firstNameErrorMessage: Locator;
  readonly lastNameErrorMessage: Locator;
  readonly emailErrorMessage: Locator;
  readonly dateOfBirthErrorMessage: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = this.page.getByRole("heading", {
      name: "Step 1 of 5: Personal Information",
      level: 2,
    });
    this.firstNameInput = this.page.getByLabel(/First Name/i);
    this.lastNameInput = this.page.getByLabel(/Last Name/i);
    this.dateOfBirthInput = this.page.getByLabel(/Date of Birth/i);
    this.emailInput = this.page.getByLabel(/Email/i);
    this.checkBox = this.page.getByRole("checkbox", {
      name: "Yes, I would like to receive information about NYPL's programs and services",
    });
    this.previousButton = this.page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });

    this.firstNameErrorMessage = this.page.getByText(
      "Please enter a valid first name."
    );
    this.lastNameErrorMessage = this.page.getByText(
      "Please enter a valid last name."
    );
    this.emailErrorMessage = this.page.getByText(
      "Please enter a valid email address."
    );
    this.dateOfBirthErrorMessage = this.page.getByText(
      "Please enter a valid date, MM/DD/YYYY, including slashes."
    );

    this.alternateFormLink = this.page.getByRole("link", {
      name: "alternate form",
      exact: true,
    });
    this.locationsLink = this.page.getByRole("link", {
      name: "locations",
      exact: true,
    });
  }
}
