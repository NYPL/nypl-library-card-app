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
      appContent?.personal?.firstName.label || /First name/i
    );
    this.firstNameError = this.page.getByText(
      ERROR_MESSAGES.FIRST_NAME_INVALID
    );
    this.lastNameInput = this.page.getByLabel(
      appContent?.personal?.lastName.label || /Last name/i
    );
    this.lastNameError = this.page.getByText(ERROR_MESSAGES.LAST_NAME_INVALID);
    this.dateOfBirthInput = this.page.getByLabel(
      appContent?.personal?.birthdate.label || /Date of birth/i
    );
    this.dateOfBirthError = this.page.getByText(
      ERROR_MESSAGES.DATE_OF_BIRTH_INVALID
    );
    this.emailInput = this.page.getByLabel(
      appContent?.personal?.email.label || /Email/i
    );
    this.emailError = this.page.getByText(ERROR_MESSAGES.EMAIL_INVALID);
    this.alternateFormLink = this.page.getByRole("link", {
      name: appContent?.personal?.email?.alternateForm || "alternate form",
      exact: true,
    });
    this.locationsLink = this.page.getByRole("link", {
      name: appContent?.personal?.email?.locations || "locations",
      exact: true,
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
