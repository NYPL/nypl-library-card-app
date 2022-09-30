import { Heading } from "@nypl/design-system-react-components";
import React from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import PersonalFormContainer from "../../src/components/PersonalFormContainer";
import { PageTitles } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

interface PageProps {
  pageTitles: PageTitles;
}

function PersonalInformationPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level="two">{pageTitles.personal}</Heading>
      <PersonalFormContainer />
    </>
  );
}

export async function getServerSideProps({ query }) {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  return {
    props: {
      // This allows this page to get the proper translations based
      // on the `lang=...` URL query param. Default to "en".
      ...(await serverSideTranslations(query?.lang || "en", ["common"])),
    },
  };
}

export default PersonalInformationPage;
