import React from "react";

import PersonalFormContainer from "../../src/components/PersonalFormContainer";
import { PageTitles } from "../../src/interfaces";

interface PageProps {
  pageTitles: PageTitles;
}

function PersonalInformationPage({ pageTitles }: PageProps) {
  return (
    <>
      <h2>{pageTitles.personal}</h2>
      <PersonalFormContainer />
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

export default PersonalInformationPage;
