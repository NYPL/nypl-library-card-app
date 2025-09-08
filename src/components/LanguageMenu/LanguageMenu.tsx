import { HorizontalRule, List } from "@nypl/design-system-react-components";
import React, { JSX } from "react";

import { languageData } from "../../data/languages";

/**
 * LanguageMenu
 * Returns a list of language links to translate the app.
 */
const LanguageMenu = (): JSX.Element => {
  // Every link item is separated by a dot.
  const languageElems = languageData.map((language) => {
    return [
      <a
        href={`/library-card/new?lang=${language.charCode}`}
        key={language.charCode}
      >
        {language.label}
      </a>,
      <span key={`span-${language.charCode}`}>·</span>,
    ];
  });
  // Flatten the array of arrays for the `List` component.
  const listItems = languageElems.reduce((a, b) => a.concat(b), []);

  return (
    <>
      <HorizontalRule bg="ui.gray.xx-dark" />
      <List
        inline
        listItems={listItems}
        noStyling
        type="ul"
        flexWrap="wrap"
        justifyContent="center"
      />
      <HorizontalRule bg="ui.gray.xx-dark" />
    </>
  );
};

export default LanguageMenu;
