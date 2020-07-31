/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { axe, toHaveNoViolations } from "jest-axe";
import "@testing-library/jest-dom/extend-expect";
import LibraryListForm, { LibraryListObject } from "../LibraryListForm";
import { TestHookFormProvider } from "../../../testHelper/utils";

expect.extend(toHaveNoViolations);

const libraryList: LibraryListObject[] = [
  { value: "eb", label: "SimplyE" },
  { value: "sasb", label: "Schwarzman" },
  { value: "schomburg", label: "Schomburg" },
];

describe("LibraryListForm", () => {
  test("passes accessibility checks", async () => {
    const { container } = render(
      <LibraryListForm libraryList={libraryList} defaultValue="eb" />,
      {
        wrapper: TestHookFormProvider,
      }
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  test("renders a label, select, and description", () => {
    render(<LibraryListForm libraryList={libraryList} defaultValue="eb" />, {
      wrapper: TestHookFormProvider,
    });

    expect(screen.getByLabelText("Home Library:")).toBeInTheDocument();
    // `combobox` is the role for `select` elements.
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    // SimplyE is the default value so it's displayed when the component loads.
    expect(screen.getByDisplayValue("SimplyE")).toBeInTheDocument();
    expect(
      screen.getByText("Select your home library from the list.")
    ).toBeInTheDocument();
  });

  test("it updates the selected value from the dropdown", async () => {
    render(<LibraryListForm libraryList={libraryList} defaultValue="eb" />, {
      wrapper: TestHookFormProvider,
    });

    const select = screen.getByRole("combobox");

    expect(screen.getByDisplayValue("SimplyE")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.click(select, { target: { value: "sasb" } })
    );
    expect(screen.getByDisplayValue("Schwarzman")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("SimplyE")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("Schomburg")).not.toBeInTheDocument();

    await act(async () =>
      fireEvent.click(select, { target: { value: "schomburg" } })
    );
    expect(screen.getByDisplayValue("Schomburg")).toBeInTheDocument();
    expect(screen.queryByDisplayValue("Schwarzman")).not.toBeInTheDocument();
    expect(screen.queryByDisplayValue("SimplyE")).not.toBeInTheDocument();
  });
});
