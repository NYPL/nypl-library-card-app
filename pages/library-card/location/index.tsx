import React from "react";

import LocationFormContainer from "../../../src/components/LocationFormContainer";

function LocationPage() {
  return (
    <>
      <h2>Step 1 of 6: Location</h2>
      <LocationFormContainer />
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

export default LocationPage;
