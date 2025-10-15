import { Page, Locator } from "@playwright/test";

export class ReviewPage {
  readonly page: Page;
  readonly mainHeading: Locator; // displays on each page
  readonly stepHeading: Locator;
  readonly personalInfoHeading: Locator;
  readonly firstNameHeading: Locator;
  readonly lastNameHeading: Locator;
  readonly dateOfBirthHeading: Locator;
  readonly emailHeading: Locator;
  readonly receiveInfoHeading: Locator;
  readonly addressHeading: Locator;
  readonly streetHeading: Locator;
  readonly cityHeading: Locator;
  readonly stateHeading: Locator;
  readonly postalCodeHeading: Locator;
  readonly addressEditButton: Locator;
  readonly editPersonalInfoButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly dateOfBirthInput: Locator;
  readonly emailInput: Locator;
  readonly receiveInfoChoice: Locator;
  readonly receiveInfoCheckbox: Locator;
  readonly alternateFormLink: Locator;
  readonly locationsLink: Locator;

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

    this.addressHeading = page.getByRole("heading", {
      name: "Address",
      level: 3,
      exact: true,
    });

    this.firstNameHeading = page.getByText("First Name", { exact: true });
    this.lastNameHeading = page.getByText("Last Name", { exact: true });
    this.dateOfBirthHeading = page.getByText("Date of Birth", { exact: true });
    this.emailHeading = page.getByText("Email Address", { exact: true });
    this.receiveInfoHeading = page.getByText(
      "Receive information about NYPL's programs and services",
      { exact: true }
    );

    this.streetHeading = page.getByText("Street Address", { exact: true });
    this.cityHeading = page.getByText("City", { exact: true });
    this.stateHeading = page.getByText("State", { exact: true });
    this.postalCodeHeading = page.getByText("Postal Code", { exact: true });
    this.addressEditButton = page.locator("#editAddressButton");

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
    this.receiveInfoChoice = page.getByText("Yes", { exact: true });
    this.receiveInfoCheckbox = page.getByText(
      "Yes, I would like to receive information about NYPL's programs and services",
      { exact: true }
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

  getText(expected: string) {
    return this.page.getByText(expected, { exact: true });
  }
}
