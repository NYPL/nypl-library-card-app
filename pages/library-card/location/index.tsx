import React, { useRef } from "react";

import LocationAddressContainer from "../../../src/components/LocationAddressContainer";

function LocationAddressPage() {
  // We use this ref to scroll to the heading every time a new location option
  // is selected so the page doesn't jump around too much.
  const scrollRef = useRef<HTMLHeadingElement>(null);

  return (
    <>
      <h2 ref={scrollRef}>Step 2 of 5: Location</h2>
      <p>
        The application process is slightly different depending on whether you
        live, work, go to school, or pay property taxes in New York City,
        elsewhere in New York State, or elsewhere in the United States and
        you&apos;re just visiting New York City. Please select one of the
        following and fill out the required fields.
      </p>
      <LocationAddressContainer scrollRef={scrollRef} />
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
