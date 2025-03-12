/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
// `import` axios does not work so it must be required.
const axios = require("axios");

jest.mock("axios");
jest.mock("react-i18next", () => {
  const en = {
    account: {
      title: "Step 4 of 5: Customize Your Account",
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
      selectLibrary: "Select a home library:",
      termsAndCondition: {
        label: "Yes, I accept the terms and conditions.",
        text:
          " By submitting an application, you understand and agree to our <a href='https://www.nypl.org/help/library-card/terms-conditions'>Cardholder Terms and Conditions</a> and agree to our <a href='https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations'>Rules and Regulations</a>. To learn more about the Library’s use of personal information, please read our <a href='https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy'>Privacy Policy</a>.",
      },
      errorMessage: {
        username: "Username must be between 5-25 alphanumeric characters.",
        password:
          "Your password must be at least 8 characters, include a mixture of both uppercase and lowercase letters, include a mixture of letters and numbers, and have at least one special character except period (.)",
        verifyPassword: "The two passwords don't match.",
        acceptTerms: "The Terms and Conditions must be checked.",
      },
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "",
      query: { lang: "en" },
      asPath: "",
    };
  },
}));

import UsernameValidationFormFields from ".";

describe("UsernameValidationFormFields", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders the basic label, input, and helper text elements", async () => {
    render(
      <TestProviderWrapper>
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    const label = screen.getByLabelText(/Username/i);
    const labelRequired = screen.getByText(/Required/i);
    const input = screen.getByRole("textbox", { name: /Username/i });
    const helperText = screen.getByText(
      "5-25 alphanumeric characters. No special characters."
    );
    const validateButton = screen.getByText("Check if username is available");

    expect(label).toBeInTheDocument();
    expect(labelRequired).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(validateButton).toBeInTheDocument();
  });

  // Rendering the validation button depends on the `getValues` function from
  // `react-hook-form`. That function returns the value of the input element.
  test("it renders a validation button if the input is valid", async () => {
    const tooShort = "user";
    const invalid = "usernam!";
    const justRight = "username";
    // We want to mock these functions from `react-hook-form` so we override
    // them and their return values here before mounting the component.
    const mockWatch = jest.fn().mockReturnValue(true);
    let mockGetValues = jest.fn().mockReturnValue(tooShort);
    const { rerender } = render(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );
    const validateButton = screen.getByText("Check if username is available");

    // On the first render, the `getValues` function will return "user" which
    // is too short and the button is disabled.
    expect(validateButton).toBeDisabled();

    // Now let's mock another invalid value.
    mockGetValues = jest.fn().mockReturnValue(invalid);
    rerender(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    // And the button should still be disabled.
    expect(validateButton).toBeDisabled();

    // Mock a valid value.
    mockGetValues = jest.fn().mockReturnValue(justRight);
    rerender(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    // Now the button will be enabled.
    expect(validateButton).toBeEnabled();
  });

  test("renders an error message from the API call and hidden input with value of false", async () => {
    const errorMessage = "This username is not available.";
    // The API will return a 400 error.
    axios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { message: errorMessage } } })
    );
    const mockWatch = jest.fn().mockReturnValue(true);
    const mockGetValues = jest.fn().mockReturnValue("notAvailableUsername");

    render(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    const validateButton = screen.getByText("Check if username is available");
    let errorMessageDisplay = screen.queryByText(errorMessage);
    expect(validateButton).toBeInTheDocument();
    expect(errorMessageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(validateButton));

    expect(axios.post).toBeCalledWith("/library-card/api/username", {
      username: "notAvailableUsername",
    });
    // Once we know that the error message _is_ in the document,
    // use `getByText`.
    errorMessageDisplay = screen.getByText(errorMessage);
    expect(errorMessageDisplay).toBeInTheDocument();
    // Since a message is displaying, the button does not render.
    expect(validateButton).toBeDisabled();
  });

  test("renders a good message response from the API call", async () => {
    const message = "This username is available.";
    axios.post.mockImplementation(() => Promise.resolve({ data: { message } }));
    const mockWatch = jest.fn().mockReturnValue(true);
    const mockGetValues = jest.fn().mockReturnValue("availableUsername");

    render(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );

    const validateButton = screen.getByText("Check if username is available");
    let messageDisplay = screen.queryByText(message);
    expect(validateButton).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(validateButton));

    expect(axios.post).toBeCalledWith("/library-card/api/username", {
      username: "availableUsername",
    });

    messageDisplay = screen.getByText(message);
    expect(messageDisplay).toBeInTheDocument();

    // The button to validate the username is now disabled since we got a
    // response from the API.
    expect(validateButton).toBeDisabled();
  });

  test("should render an error message if the input is invalid", async () => {
    const invalid = "test!!";
    const mockGetValues = jest.fn().mockReturnValue(invalid);
    const message = "Username must be between 5-25 alphanumeric characters.";
    // Error-like object returned from react-hook-form
    const errors = {
      username: { message },
    };

    // This essentially tests both the `errors` and `errorMessage` props. The
    // `errorMessage` prop sets up the error message that react-hook-form will
    // return if the input value is wrong. But in this test, we are mocking
    // the `errors` object that react-hook-form returns so we are both, setting
    // it up and returning it.
    render(
      <TestProviderWrapper hookFormState={{ getValues: mockGetValues, errors }}>
        <UsernameValidationFormFields id="username-test" />
      </TestProviderWrapper>
    );
    // Casting the returned value so we can access `value`.
    const input = screen.getByRole("textbox") as HTMLInputElement;
    expect(input).toBeInTheDocument();
    await act(async () =>
      fireEvent.change(input, { target: { value: invalid } })
    );
    expect(input.value).toEqual(invalid);

    const errorMessage = screen.getByText(message);
    expect(errorMessage).toBeInTheDocument();
  });
});
