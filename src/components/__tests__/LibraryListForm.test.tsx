/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import LibraryListForm, { LibraryListObject } from "../LibraryListForm";
import { TestHookFormProvider } from "../../../testHelper/utils";
import {
  FormDataContextProvider,
  formInitialState,
} from "../../context/FormDataContext";

expect.extend(toHaveNoViolations);

const libraryList: LibraryListObject[] = [
  { value: "eb", label: "SimplyE" },
  { value: "sasb", label: "Schwarzman" },
  { value: "schomburg", label: "Schomburg" },
];

describe("LibraryListForm", () => {
  test("passes accessibility checks", async () => {
    const { container } = render(
      <FormDataContextProvider initState={formInitialState}>
        <LibraryListForm libraryList={libraryList} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a label, input, and description", () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LibraryListForm libraryList={libraryList} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    expect(screen.getByLabelText("Home Library:")).toBeInTheDocument();
    // "textbox" is the role for the input element.
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Select your home library from the list. Start by typing the name of the library."
      )
    ).toBeInTheDocument();
  });

  test("it updates the selected value from the dropdown", async () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LibraryListForm libraryList={libraryList} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    const input = screen.getByRole("textbox");

    // Default input value:
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Schwarzman" } })
    );
    input.focus();

    // Instead of `getByDisplayValue`, we want to `getByText` since this the
    // suggestions are rendered in a list element.
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Schomburg" } })
    );
    input.focus();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
  });

  test("it shows the suggestions", async () => {
    render(
      <FormDataContextProvider initState={formInitialState}>
        <LibraryListForm libraryList={libraryList} />
      </FormDataContextProvider>,
      {
        wrapper: TestHookFormProvider,
      }
    );

    const input = screen.getByRole("textbox");

    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByText("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByText("Schomburg")).not.toBeInTheDocument();

    await act(async () => fireEvent.change(input, { target: { value: "S" } }));
    input.focus();

    // All suggestions start with "S" so we expect all to show up.
    expect(screen.getByText("SimplyE")).toBeInTheDocument();
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();

    await act(async () =>
      fireEvent.change(input, { target: { value: "Sch" } })
    );
    input.focus();

    // But now we search by "Sch" so only two should display.
    expect(screen.queryByText("SimplyE")).not.toBeInTheDocument();
    expect(screen.getByText("Schwarzman")).toBeInTheDocument();
    expect(screen.getByText("Schomburg")).toBeInTheDocument();
  });
});
