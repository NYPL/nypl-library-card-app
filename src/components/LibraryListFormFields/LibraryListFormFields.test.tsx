import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe } from "jest-axe";
import LibraryListFormFields from ".";
import { TestProviderWrapper } from "../../../testHelper/utils";
import { LibraryListObject } from "../../interfaces";

jest.mock("react-i18next", () => {
  const en = {
    account: {
      selectLibrary: "Select a home library:",
    },
  };
  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: (str) => en["account"][str.substr(str.indexOf(".") + 1)],
    }),
  };
});

const libraryList: LibraryListObject[] = [
  { value: "eb", label: "SimplyE" },
  { value: "sasb", label: "Schwarzman" },
  { value: "schomburg", label: "Schomburg" },
];

describe("LibraryListFormFields", () => {
  test("passes axe accessibility checks", async () => {
    const { container } = render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a label, input, and description", () => {
    render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
    );

    expect(screen.getByLabelText("Select a home library:")).toBeInTheDocument();
    // "textbox" is the role for the input element.
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  test("it updates the selected value from the dropdown", async () => {
    render(
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
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
      <TestProviderWrapper>
        <LibraryListFormFields libraryList={libraryList} />
      </TestProviderWrapper>
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
