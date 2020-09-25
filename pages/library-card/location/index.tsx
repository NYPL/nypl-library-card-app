import React from "react";

import LocationAddressContainer from "../../../src/components/LocationAddressContainer";

function LocationAddressPage() {
  return (
    <>
      <h2>Step 2 of 5: Location</h2>
      <LocationAddressContainer />
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

export default LocationAddressPage;
