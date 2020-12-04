/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import { TestProviderWrapper } from "../../../testHelper/utils";
// `import` axios does not work so it must be required.
const axios = require("axios");

expect.extend(toHaveNoViolations);
jest.mock("axios");

import UsernameValidationFormFields from ".";

describe("UsernameValidationFormFields", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders the basic label, input, and helper text elements", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    const label = screen.getByText("Username");
    const labelRequired = screen.getByText("Required");
    const input = screen.getByRole("textbox", { name: "Username Required" });
    const helperText = screen.getByText(
      "5-25 alphanumeric characters. No special characters."
    );
    // `query*` return null rather than throw an error, so use this instead
    // of `getBy*` since we _don't_ expect the button to be there.
    const validateButton = screen.queryByRole("button");
    // Since this is hidden and the user does not see it, let's use the
    // querySelector function.
    const hiddenInput = container.querySelector(
      "[name=usernameHasBeenValidated]"
    );

    expect(label).toBeInTheDocument();
    expect(labelRequired).toBeInTheDocument();
    expect(input).toBeInTheDocument();
    expect(helperText).toBeInTheDocument();
    expect(validateButton).not.toBeInTheDocument();
    expect(hiddenInput).not.toBeInTheDocument();
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
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );
    let validateButton = screen.queryByRole("button");

    // On the first render, the `getValues` function will return "user" which
    // is too short and the button won't render.
    expect(validateButton).not.toBeInTheDocument();

    // Now let's mock another invalid value.
    mockGetValues = jest.fn().mockReturnValue(invalid);
    rerender(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    validateButton = screen.queryByRole("button");
    // And the button should still not render.
    expect(validateButton).not.toBeInTheDocument();

    // Mock a valid value.
    mockGetValues = jest.fn().mockReturnValue(justRight);
    rerender(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    validateButton = screen.queryByRole("button");
    // Now the button will render.
    expect(validateButton).toBeInTheDocument();
  });

  test("renders an error message from the API call and hidden input with value of false", async () => {
    const errorMessage = "This username is not available.";
    // The API will return a 400 error.
    axios.post.mockImplementation(() =>
      Promise.reject({ response: { data: { message: errorMessage } } })
    );
    const mockWatch = jest.fn().mockReturnValue(true);
    const mockGetValues = jest.fn().mockReturnValue("notAvailableUsername");

    const { container } = render(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    const button = await screen.findByText("Check if username is available");
    // `queryByText` returns null so it's useful to check that the error
    // message is _not_ in the document.
    let errorMessageDisplay = screen.queryByText(errorMessage);
    expect(button).toBeInTheDocument();
    expect(errorMessageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(button));

    expect(axios.post).toBeCalledWith("/library-card/api/username", {
      username: "notAvailableUsername",
      csrfToken: null,
    });
    // Once we know that the error message _is_ in the document,
    // use `getByText`.
    errorMessageDisplay = screen.getByText(errorMessage);
    expect(errorMessageDisplay).toBeInTheDocument();
    // Since a message is displaying, the button does not render.
    expect(button).not.toBeInTheDocument();

    // Any response also renders a hidden input with the available value from
    // the API call. In this case it is false since it was an error response.
    const hiddenInput = container.querySelector(
      "[name=usernameHasBeenValidated]"
    ) as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput.value).toEqual("false");
  });

  test("renders a good message response from the API call", async () => {
    const message = "This username is available.";
    axios.post.mockImplementation(() => Promise.resolve({ data: { message } }));
    const mockWatch = jest.fn().mockReturnValue(true);
    const mockGetValues = jest.fn().mockReturnValue("availableUsername");

    const { container } = render(
      <TestProviderWrapper
        hookFormState={{ getValues: mockGetValues, watch: mockWatch }}
      >
        <UsernameValidationFormFields />
      </TestProviderWrapper>
    );

    const button = await screen.findByText("Check if username is available");
    let messageDisplay = screen.queryByText(message);
    expect(button).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(button));

    expect(axios.post).toBeCalledWith("/library-card/api/username", {
      username: "availableUsername",
      csrfToken: null,
    });

    messageDisplay = screen.getByText(message);
    expect(messageDisplay).toBeInTheDocument();

    // The button to validate the username goes away since we got a
    // response from the API.
    expect(button).not.toBeInTheDocument();

    // The hidden input value is now "true".
    const hiddenInput = container.querySelector(
      "[name=usernameHasBeenValidated]"
    ) as HTMLInputElement;
    expect(hiddenInput).toBeInTheDocument();
    expect(hiddenInput.value).toEqual("true");
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
        <UsernameValidationFormFields />
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
