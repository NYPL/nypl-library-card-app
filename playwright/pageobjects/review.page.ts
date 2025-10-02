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
  readonly emailHeading: Locator;
  readonly receiveInfoHeading: Locator;
  readonly receiveInfoChoice: Locator;

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
    this.emailHeading = page.getByText("Email Address", { exact: true });
    this.receiveInfoHeading = page.getByText(
      "Receive information about NYPL's programs and services",
      { exact: true }
    );
    this.receiveInfoChoice = page.getByText("Yes", { exact: true });
  }
}
