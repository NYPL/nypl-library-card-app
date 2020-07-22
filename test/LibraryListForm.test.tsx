/* eslint-disable */
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";

import LibraryListForm, {
  LibraryListObject,
} from "../src/components/LibraryListForm";

const libraryList: LibraryListObject[] = [
  { value: "eb", label: "SimplyE" },
  { value: "sasb", label: "Schwarzman" },
  { value: "schomburg", label: "Schomburg" },
];

describe("LibraryListForm", () => {
  test("renders a label, select, and description", () => {
    const mockRegister = jest.fn();

    render(
      <LibraryListForm
        register={mockRegister}
        libraryList={libraryList}
        defaultValue="eb"
      />
    );

    expect(screen.getByLabelText("Home Library:")).toBeInTheDocument();
    // `combobox` is the role for `select` elements.
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    // SimplyE is the default value so it's displayed when the component loads.
    expect(screen.getByDisplayValue("SimplyE")).toBeInTheDocument();
    expect(
      screen.getByText("Select your home library from the list.")
    ).toBeInTheDocument();
  });

  test("it updates the selected value from the dropdown", () => {
    const mockRegister = jest.fn();

    render(
      <LibraryListForm
        register={mockRegister}
        libraryList={libraryList}
        defaultValue="eb"
      />
    );

    const select = screen.getByRole("combobox");

    expect(screen.getByDisplayValue("SimplyE")).toBeInTheDocument();

    fireEvent.change(select, { target: { value: "sasb" } });

    expect(screen.getByDisplayValue("Schwarzman")).toBeInTheDocument();
  });
});
