import { Page, Locator } from "@playwright/test";
import { TEST_PATRON_INFO } from "../utils/constants";

export class ReviewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly personalInfoHeading: Locator;
  readonly firstNameHeading: Locator;
  readonly firstNameValue: Locator;
  readonly lastNameHeading: Locator;
  readonly lastNameValue: Locator;
  readonly dateOfBirthHeading: Locator;
  readonly dateOfBirthValue: Locator;
  readonly emailHeading: Locator;
  readonly emailValue: Locator;
  readonly receiveInfoHeading: Locator;
  readonly receiveInfoChoice: Locator;
  readonly editPersonalInfoButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emailInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainHeading = page.getByRole("heading", {
      name: "Apply for a Library Card Online",
      level: 1,
    });
    this.stepHeading = page.getByRole("heading", {
      name: "Step 5 of 5: Confirm Your Information",
      level: 2,
    });
    this.personalInfoHeading = page.getByRole("heading", {
      name: "Personal Information",
      level: 3,
    });
    this.firstNameHeading = page.getByText("First Name", { exact: true });
    this.firstNameValue = page.getByText(TEST_PATRON_INFO.firstName, {
      exact: true,
    });
    this.lastNameHeading = page.getByText("Last Name", { exact: true });
    this.lastNameValue = page.getByText(TEST_PATRON_INFO.lastName, {
      exact: true,
    });
    this.dateOfBirthHeading = page.getByText("Date of Birth", { exact: true });
    this.dateOfBirthValue = page.getByText(TEST_PATRON_INFO.dateOfBirth, {
      exact: true,
    });
    this.emailHeading = page.getByText("Email Address", { exact: true });
    this.emailValue = page.getByText(TEST_PATRON_INFO.email, { exact: true });
    this.receiveInfoHeading = page.getByText(
      "Receive information about NYPL's programs and services",
      { exact: true }
    );
    this.receiveInfoChoice = page.getByText("Yes", { exact: true });
    this.editPersonalInfoButton = page
      .getByRole("button", {
        name: "Edit",
        exact: true,
      })
      .first();
    this.firstNameInput = page.getByRole("textbox", {
      name: "First Name (Required)",
      exact: true,
    });
    this.lastNameInput = page.getByRole("textbox", {
      name: "Last Name (Required)",
      exact: true,
    });
    this.dateOfBirthInput = page.getByRole("textbox", {
      name: "Date of Birth (Required)",
      exact: true,
    });
    this.emailInput = page.getByRole("textbox", {
      name: "Email Address (Required)",
      exact: true,
    });
  }
}
