import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import WorkAddressContainer from "../../src/components/WorkAddressContainer";
import { PageTitles } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

interface PageProps {
  pageTitles: PageTitles;
}

function WorkAddressPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level={2}>{pageTitles.workAddress}</Heading>
      <p>
        The application process is slightly different depending on whether you
        live, work, go to school, or pay property taxes in New York City,
        elsewhere in New York State, or elsewhere in the United States and
        you&apos;re just visiting New York City. Please select one of the
        following and fill out the required fields.
      </p>
      <WorkAddressContainer />
    </>
  );
}

export async function getServerSideProps({ query }) {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  return { props: {} };
}

export default WorkAddressPage;
