import React from "react";
import { render, screen, act } from "@testing-library/react";
import { axe } from "jest-axe";
import AddressVerificationContainer from ".";
import { mockTFunction, TestProviderWrapper } from "../../../testHelper/utils";
import { formInitialState } from "../../context/FormDataContext";
import { AddressResponse } from "../../interfaces";

jest.mock("react-i18next", () => {
  const en = {
    location: {
      title: "Paso 2 de 5: Dirección",
      address: {
        title: "Dirección de domicilio",
        description:
          "Si vive en la ciudad de Nueva York, por favor complete el formulario de domicilio.",
        line1: { label: "Calle" },
        line2: { label: "Departamento/Suite" },
        city: { label: "Ciudad" },
        state: { label: "Estado", instruction: "Abreviación de 2 letras" },
        postalCode: {
          label: "Código postal",
          instruction: "Código postal de 5 ó 9 dígitos",
        },
      },
      workAddress: {
        title: "Dirección alternativa",
        description: {
          part1:
            "El proceso de solicitud es un poco diferente dependiendo de si usted vive, trabaja, estudia o paga impuestos sobre la propiedad en la ciudad de Nueva York, en otro lugar del estado de Nueva York o en otro lugar de Estados Unidos, o si solo está de visita en la ciudad de Nueva York. Seleccione una de las siguientes opciones y complete los campos obligatorios.",
          part2:
            "Si trabaja o estudia en la ciudad de Nueva York, indique la dirección.",
        },
      },
      errorMessage: {
        line1: "Ingrese una dirección postal válida.",
        city: "Ingrese una ciudad válida.",
        state: "Ingrese la abreviación de 2 caracteres del estado.",
        zip: "Ingrese un código postal de 5 o 9 dígitos.",
      },
    },
    verifyAddress: {
      title: "Paso 3 de 5: verificación de la dirección",
      description: "Seleccione la dirección correcta.",
      homeAddress: "Dirección de domicilio",
      workAddress: "Dirección alternativa",
    },
    button: {
      start: "Get Started",
      edit: "Edit",
      submit: "Submit",
      next: "Next",
      previous: "Previous",
    },
  };

  return {
    // this mock makes sure any components using the translate hook can use it without a warning being shown
    useTranslation: () => ({
      t: mockTFunction(en),
    }),
  };
});

describe("AddressVerificationContainer accessibility", () => {
  test("passes axe accessibility test", async () => {
    await act(async () => {
      const { container } = render(
        <TestProviderWrapper>
          <AddressVerificationContainer />
        </TestProviderWrapper>
      );
      expect(await axe(container)).toHaveNoViolations();
    });
  });
});

describe("AddressVerificationContainer", () => {
  test("renders a home address", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          detail: "",
          reason: "",
          success: true,
        },
        work: {} as AddressResponse,
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();
  });

  test("renders multiple home addresses", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: [
            {
              line1: "1234 61st",
              city: "Woodside",
              state: "NY",
              zip: "11377",
            },
            {
              line1: "5678 61st",
              city: "Woodside",
              state: "NY",
              zip: "11388",
            },
          ],
          detail: "",
          reason: "",
          success: true,
        },
        work: {} as AddressResponse,
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();
  });

  test("renders an optional work address", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: undefined,
          detail: "",
          success: true,
          reason: "",
        },
        work: {
          cardType: "standard",
          address: {
            line1: "476 5th Ave",
            city: "New York",
            state: "NY",
            zip: "10018",
          },
          addresses: undefined,
          detail: "",
          success: true,
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("1234 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();

    expect(screen.getByText("476 5th Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10018")).toBeInTheDocument();
  });

  test("renders multiple optional work addresses", async () => {
    const initState = {
      ...formInitialState,
      addressesResponse: {
        home: {
          cardType: "standard",
          address: {
            line1: "1234 61st",
            city: "Woodside",
            state: "NY",
            zip: "11377",
          },
          addresses: [
            {
              line1: "1234 61st",
              city: "Woodside",
              state: "NY",
              zip: "11377",
            },
            {
              line1: "5678 61st",
              city: "Woodside",
              state: "NY",
              zip: "11388",
            },
          ],
          detail: "",
          success: true,
          reason: "",
        },
        work: {
          cardType: "standard",
          address: {
            line1: "476 5th Ave",
            city: "New York",
            state: "NY",
            zip: "10018",
          },
          addresses: [
            {
              line1: "476 5th Ave",
              city: "New York",
              state: "NY",
              zip: "10018",
            },
            {
              line1: "1111 1st Ave",
              city: "New York",
              state: "NY",
              zip: "10001",
            },
          ],
          detail: "",
          success: true,
          reason: "",
        },
      },
    };
    render(
      <TestProviderWrapper formDataState={initState}>
        <AddressVerificationContainer />
      </TestProviderWrapper>
    );

    expect(screen.getByText("Woodside, NY 11377")).toBeInTheDocument();
    expect(screen.getByText("5678 61st")).toBeInTheDocument();
    expect(screen.getByText("Woodside, NY 11388")).toBeInTheDocument();

    expect(screen.getByText("New York, NY 10018")).toBeInTheDocument();
    expect(screen.getByText("1111 1st Ave")).toBeInTheDocument();
    expect(screen.getByText("New York, NY 10001")).toBeInTheDocument();
  });
});
