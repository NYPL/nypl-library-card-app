import { HorizontalRule, List } from "@nypl/design-system-react-components";
import React, { JSX } from "react";

import { languageData } from "../../data/languages";

/**
 * LanguageMenu
 * Returns a list of language links to translate the app.
 */
const LanguageMenu = (): JSX.Element => {
  // Every link item is separated by a dot.
  const languageElems = languageData.map((language, idx) => {
    const isLastItem = idx === languageData.length - 1;
    return [
      <a
        href={`/library-card/new?lang=${language.charCode}`}
        key={language.charCode}
      >
        {language.label}
      </a>,
      isLastItem ? null : <span key={`span-${language.charCode}`}>·</span>,
    ];
  });
  // Flatten the array of arrays for the `List` component.
  const listItems = languageElems.reduce((a, b) => a.concat(b), []);

  return (
    <>
      <HorizontalRule bg="ui.gray.xx-dark" mb="s" />
      <List
        inline
        listItems={listItems}
        noStyling
        variant="ul"
        flexWrap="wrap"
        justifyContent="center"
      />
      <HorizontalRule bg="ui.gray.xx-dark" my="s" />
    </>
  );
};

export default LanguageMenu;
