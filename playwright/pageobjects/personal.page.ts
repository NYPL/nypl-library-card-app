import { Page, Locator } from "@playwright/test";
import { ERROR_MESSAGES } from "../utils/constants";

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

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = this.page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = this.page.getByRole("heading", {
      name: "Step 1 of 5: Personal information",
      level: 2,
    });
    this.firstNameInput = this.page.getByLabel(/First name/i);
    this.firstNameError = this.page.getByText(
      ERROR_MESSAGES.FIRST_NAME_INVALID
    );
    this.lastNameInput = this.page.getByLabel(/Last name/i);
    this.lastNameError = this.page.getByText(ERROR_MESSAGES.LAST_NAME_INVALID);
    this.dateOfBirthInput = this.page.getByLabel(/Date of birth/i);
    this.dateOfBirthError = this.page.getByText(
      ERROR_MESSAGES.DATE_OF_BIRTH_INVALID
    );
    this.emailInput = this.page.getByLabel(/Email/i);
    this.emailError = this.page.getByText(ERROR_MESSAGES.EMAIL_INVALID);
    this.alternateFormLink = this.page.getByRole("link", {
      name: "alternate form",
    });
    this.locationsLink = this.page.getByRole("link", {
      name: "locations",
      exact: true,
    });
    this.receiveInfoCheckbox = this.page.getByText(
      "Yes, I would like to receive information about NYPL's programs and services"
    );

    this.previousButton = this.page.getByRole("link", {
      name: "Previous",
      exact: true,
    });
    this.nextButton = this.page.getByRole("button", {
      name: "Next",
      exact: true,
    });
  }
}
