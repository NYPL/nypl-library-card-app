import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

function PersonalInformationPage() {
  return (
    <div>
      <h2>Step 2 of 6: Personal Information</h2>
      <RoutingLinks
        previous={{ url: "/library-card/location" }}
        next={{ url: "/library-card/address" }}
      />
    </div>
  );
}

export default PersonalInformationPage;
