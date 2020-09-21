import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";
import LibraryCardForm from "../../../src/components/LibraryCardForm";

function LocationPage() {
  return (
    <div>
      <h2>Step 1 of 6: Location</h2>
      <LibraryCardForm />
      <RoutingLinks
        previous={{ url: "/library-card/new" }}
        next={{ url: "/library-card/personal" }}
      />
    </div>
  );
}

export default LocationPage;
