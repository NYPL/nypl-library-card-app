import React from "react";

import AddressFormContainer from "../../../src/components/AddressFormContainer";

function AddressPage() {
  return (
    <>
      <h2>Step 3 of 6: Address</h2>
      <AddressFormContainer />
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

export default AddressPage;
