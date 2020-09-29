import React from "react";

import AddressVerificationContainer from "../../../src/components/AddressVerificationContainer";

function AddressVerificationPage() {
  return (
    <>
      <h2>Step 3 of 5: Address Verification</h2>
      <h3>Please select the correct address.</h3>
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
