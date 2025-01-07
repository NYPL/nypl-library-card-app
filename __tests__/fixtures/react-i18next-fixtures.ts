export const mockConfirmation = {
  title: "congrats title",
  description: {
    part1: "congrats part1",
    part2: "congrats part2",
    part3: "congrats part3",
  },
  nextSteps: {
    explore: "congrats explore",
    borrow: "congrats borrow",
    updates: "congrats updates",
    more: "congrats more",
  },
};
export const mockPersonal = {
  title: "Step 1 of 5: Personal Information",
  firstName: {
    label: "First Name",
  },
  lastName: {
    label: "Last Name",
  },
  birthdate: {
    label: "Date of Birth",
  },
  ageGate: "Yes, I am over 13 years old.",
  email: {
    label: "Email Address",
  },
  eCommunications: {
    labelText:
      "Yes, I would like to receive information about NYPL's programs and services",
  },
};
export const mockLocation = {
  address: {
    title: "Home Address",
    line1: { label: "Street Address" },
    line2: { label: "Apartment / Suite" },
    city: { label: "City" },
    state: { label: "State", instruction: "2-letter abbreviation" },
    postalCode: {
      label: "Postal Code",
      instruction: "5 or 9-digit postal code",
    },
  },
};
export const mockAccount = {
  title: "Step 4 of 5: Customize Your Account",
  description:
    "Create a username and password so you can log in and manage your account or access an array of our digital resources. Your username should be unique.",
  username: {
    label: "Username",
    instruction: "5-25 alphanumeric characters. No special characters.",
    checkButton: "Check if username is available",
  },
  password: {
    label: "Password",
    instruction:
      "We encourage you to select a strong password that includes: at least 8 characters, a mixture of uppercase and lowercase letters, a mixture of letters and numbers, and at least one special character <i>except</i> period (.) <br />Example: MyLib1731@<br />Password cannot contain common patterns such as consecutively repeating a character three or more times, e.g. aaaatf54 or repeating a pattern, e.g. abcabcab",
  },
  verifyPassword: {
    label: "Verify Password",
    instruction: "8-32 characters",
  },
  showPassword: "Show Password",
  library: {
    selectLibrary: "Select a home library:",
    placeholder: "Type a library name, such as Parkchester Library",
    title: "Home Library",
    description: {
      part1:
        "Choosing a home library will help us make sure you&apos;re getting everything you need from a branch that&apos;s most convenient for you.",
      part2:
        "You can skip this step and update it at any point through your account.",
    },
  },
};
export const mockReview = {
  title: "Step 5 of 5: Confirm Your Information",
  description:
    "Make sure all the information you’ve entered is correct. If needed, you can still make changes before you submit your application.",
  section: {
    personal: "Personal Information",
    address: {
      label: "Address",
      location: "Location",
      home: "Home",
      work: "Work",
    },
    homeLibrary: "Home Library",
  },
  createAccount: "Create Your Account",
  receiveNewsletter: "Receive information about NYPL's programs and services",
  yes: "Yes",
  no: "No",
  nextStep:
    "After you submit your application, you will see a confirmation page with your account information, and you will be able to log in and request books and materials.",
};
export const mockButton = {
  start: "Get Started",
  edit: "Edit",
  submit: "Submit",
  next: "Next",
  previous: "Previous",
};
