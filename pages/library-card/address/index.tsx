import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

function AddressPage() {
  return (
    <>
      <h2>Step 3 of 6: Address</h2>
      <RoutingLinks
        previous={{ url: "/library-card/personal" }}
        next={{ url: "/library-card/address-verification" }}
      />
    </>
  );
}

export default AddressPage;
