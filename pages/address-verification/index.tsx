import React from "react";
import { Heading } from "@nypl/design-system-react-components";

import AddressVerificationContainer from "../../src/components/AddressVerificationContainer";
import { PageTitles } from "../../src/interfaces";

interface PageProps {
  pageTitles: PageTitles;
}

function AddressVerificationPage({ pageTitles }: PageProps) {
  return (
    <>
      <Heading level={2}>{pageTitles.verification}</Heading>
      <p>Please select the correct address.</p>
      <AddressVerificationContainer />
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

export default AddressVerificationPage;
