/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import { TestHookFormProvider } from "../../../testHelper/utils";
// `import` axios does not work so it must be required.
const axios = require("axios");

expect.extend(toHaveNoViolations);
jest.mock("axios");

import UsernameValidationForm from "../UsernameValidationForm";

describe("UsernameValidationForm", () => {
  beforeEach(() => {
    axios.mockClear();
  });

  test("passes accessibility checks", async () => {
    const { container } = render(<UsernameValidationForm />, {
      wrapper: TestHookFormProvider,
    });

    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders the basic label, input, and helper text elements", async () => {
    const { container } = render(<UsernameValidationForm />, {
      wrapper: TestHookFormProvider,
    });

    const label = screen.getByText("Username");
    const labelRequired = screen.getByText("Required");
    const input = screen.getByRole("textbox", { name: "Username Required" });
    const helperText = screen.getByText("5-25 alphanumeric characters");
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
      <TestHookFormProvider getValues={mockGetValues} watch={mockWatch}>
        <UsernameValidationForm />
      </TestHookFormProvider>
    );
    let validateButton = screen.queryByRole("button");

    // On the first render, the `getValues` function will return "user" which
    // is too short and the button won't render.
    expect(validateButton).not.toBeInTheDocument();

    // Now let's mock another invalid value.
    mockGetValues = jest.fn().mockReturnValue(invalid);
    rerender(
      <TestHookFormProvider getValues={mockGetValues} watch={mockWatch}>
        <UsernameValidationForm />
      </TestHookFormProvider>
    );

    validateButton = screen.queryByRole("button");
    // And the button should still not render.
    expect(validateButton).not.toBeInTheDocument();

    // Mock a valid value.
    mockGetValues = jest.fn().mockReturnValue(justRight);
    rerender(
      <TestHookFormProvider getValues={mockGetValues} watch={mockWatch}>
        <UsernameValidationForm />
      </TestHookFormProvider>
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
      <TestHookFormProvider watch={mockWatch} getValues={mockGetValues}>
        <UsernameValidationForm />
      </TestHookFormProvider>
    );

    const button = await screen.findByText("Check if username is available");
    // `queryByText` returns null so it's useful to check that the error
    // message is _not_ in the document.
    let errorMessageDisplay = screen.queryByText(errorMessage);
    expect(button).toBeInTheDocument();
    expect(errorMessageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(button));

    expect(axios.post).toBeCalledWith("/api/username", {
      username: "notAvailableUsername",
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
      <TestHookFormProvider watch={mockWatch} getValues={mockGetValues}>
        <UsernameValidationForm />
      </TestHookFormProvider>
    );

    const button = await screen.findByText("Check if username is available");
    let messageDisplay = screen.queryByText(message);
    expect(button).toBeInTheDocument();
    expect(messageDisplay).not.toBeInTheDocument();

    await act(async () => fireEvent.click(button));

    expect(axios.post).toBeCalledWith("/api/username", {
      username: "availableUsername",
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
      <TestHookFormProvider errors={errors} getValues={mockGetValues}>
        <UsernameValidationForm />
      </TestHookFormProvider>
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
