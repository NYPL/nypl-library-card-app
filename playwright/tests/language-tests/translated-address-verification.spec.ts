import { test, expect } from "@playwright/test";
import appContent from "../../../public/locales/es/common.json";
import { fillAddress } from "../../utils/form-helper";
import { TEST_OOS_ADDRESS } from "../../utils/constants";
import { PageManager } from "../../pageobjects/page-manager.page";

export const HOME_ADDRESS_ES = {
  MAIN_HEADING: appContent.banner.title,
  STEP_HEADING: appContent.location.title,
  INSTRUCTIONS: appContent.internationalInstructions,
  HOME_ADDRESS_HEADING: appContent.location.address.title,
  DESCRIPTION: appContent.location.address.description,
  STREET_LABEL: appContent.location.address.line1.label,
  PREVIOUS_BUTTON: appContent.button.previous,
  NEXT_BUTTON: appContent.button.next,
};

export const ALTERNATE_ADDRESS_ES = {
  MAIN_HEADING: appContent.banner.title,
  STEP_HEADING: appContent.location.workAddress.title,
  DESCRIPTION: appContent.location.workAddress.description,
  ALTERNATE_ADDRESS_HEADING: appContent.location.workAddress.title,
  PREVIOUS_BUTTON: appContent.button.previous,
  NEXT_BUTTON: appContent.button.next,
};

export const ADDRESS_VERIFICATION_ES = {
  MAIN_HEADING: appContent.banner.title,
  STEP_HEADING: appContent.verifyAddress.title,
  DESCRIPTION: appContent.verifyAddress.description,
  HOME_ADDRESS_HEADING: appContent.verifyAddress.homeAddress,
  ALTERNATE_ADDRESS_HEADING: appContent.verifyAddress.workAddress,
  PREVIOUS_BUTTON: appContent.button.previous,
  NEXT_BUTTON: appContent.button.next,
};

test.describe("Spanish language tests for address pages", () => {
  test("Spanish snapshot tests", async ({ page }) => {
    await test.step("displays Spanish elements on Home Address page", async () => {
      await page.goto("/library-card/location?newCard=true&lang=es");
      await expect(page.locator("header")).toMatchAriaSnapshot(
        `- heading "Solicite una tarjeta de la Biblioteca en línea" [level=1]`
      );
      await expect(page.locator("#mainContent")).toMatchAriaSnapshot(`
        - main:
          - 'heading "Paso 2 de 5: Dirección" [level=2]'
          - text: Los campos del formulario se deben completar únicamente con caracteres latinos.
          - heading "Dirección de domicilio" [level=3]
          - text: Si vive en la ciudad de Nueva York, por favor complete el formulario de domicilio. Calle (Requerido)
          - textbox "Calle (Requerido)"
          - text: Departamento/Suite
          - textbox "Departamento/Suite"
          - text: Ciudad (Requerido)
          - textbox "Ciudad (Requerido)"
          - text: Estado (Requerido)
          - textbox "Estado (Requerido)"
          - text: Abreviación de 2 letras Código postal (Requerido)
          - textbox "Código postal (Requerido)"
          - text: Código postal de 5 ó 9 dígitos
          - link "Previo":
            - /url: /library-card/personal?&newCard=true&lang=es
          - button "Próximo"
        `);
    });
    await test.step("fills and clicks next button", async () => {
      const pageManager = new PageManager(page);
      await fillAddress(pageManager.addressPage, TEST_OOS_ADDRESS);
      await page
        .getByRole("button", { name: HOME_ADDRESS_ES.NEXT_BUTTON })
        .click();
    });

    await test.step("displays Spanish elements on Alternate Address page", async () => {
      await expect(page.locator("header")).toMatchAriaSnapshot(
        `- heading "Solicite una tarjeta de la Biblioteca en línea" [level=1]`
      );
      await expect(page.locator("#mainContent")).toMatchAriaSnapshot(`
          - main:
            - heading "Dirección alternativa" [level=2]
            - text: El proceso de solicitud es un poco diferente dependiendo de si usted vive, trabaja, estudia o paga impuestos sobre la propiedad en la ciudad de Nueva York, en otro lugar del estado de Nueva York o en otro lugar de Estados Unidos, o si solo está de visita en la ciudad de Nueva York. Seleccione una de las siguientes opciones y complete los campos obligatorios. Los campos del formulario se deben completar únicamente con caracteres latinos.
            - heading "Dirección alternativa" [level=3]
            - text: Si trabaja o estudia en la ciudad de Nueva York, indique la dirección. Calle
            - textbox "Calle"
            - text: Departamento/Suite
            - textbox "Departamento/Suite"
            - text: Ciudad
            - textbox "Ciudad"
            - text: Estado
            - textbox "Estado"
            - text: Abreviación de 2 letras Código postal
            - textbox "Código postal"
            - text: Código postal de 5 ó 9 dígitos
            - link "Previo":
              - /url: /library-card/location?&newCard=true&lang=es
            - button "Próximo"
          `);
    });
    await test.step("displays Spanish elements on Address Verification page", async () => {
      await expect(page.locator("header")).toMatchAriaSnapshot(
        `- heading "Solicite una tarjeta de la Biblioteca en línea" [level=1]`
      );
      await expect(page.locator("#mainContent")).toMatchAriaSnapshot(`
        - main:
          - 'heading "Paso 3 de 5: verificación de la dirección" [level=2]'
          - text: Seleccione la dirección correcta.
          - heading "Dirección de domicilio" [level=3]
          - text: Dirección de domicilio
          - radiogroup "Dirección de domicilio":
            - radio /\\d+ NY, NY \\d+/ [checked]
          - heading "Dirección alternativa" [level=3]
          - text: Dirección alternativa
          - radiogroup "Dirección alternativa":
            - radio /\\d+ ,/ [checked]
          - link "Previo":
            - /url: /library-card/location?&newCard=true&lang=es
          - button "Próximo"
        `);
    });
  });
});
