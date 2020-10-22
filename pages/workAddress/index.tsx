import React from "react";

import WorkAddressContainer from "../../src/components/WorkAddressContainer";
import { PageTitles } from "../../src/interfaces";

interface PageProps {
  pageTitles: PageTitles;
}

function WorkAddressPage({ pageTitles }: PageProps) {
  return (
    <>
      <h2>{pageTitles.workAddress}</h2>
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

export async function getServerSideProps({ res, query }) {
  // We only want to show this from a form submission. If we are not coming
  // to the confirmation page from a successful form submission, then
  // redirect to the form page.
  if (!query.newCard) {
    res.writeHead(301, {
      Location: "/",
    });
    res.end();
  }
  return { props: {} };
}

export default WorkAddressPage;