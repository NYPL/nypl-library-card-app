import React from "react";

import AddressVerificationContainer from "../../src/components/AddressVerificationContainer";
import { PageTitles } from "../../src/interfaces";

interface PageProps {
  pageTitles: PageTitles;
}

function AddressVerificationPage({ pageTitles }: PageProps) {
  return (
    <>
      <h2>{pageTitles.verification}</h2>
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
