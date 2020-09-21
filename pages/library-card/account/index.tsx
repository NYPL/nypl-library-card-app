import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

function AccountPage() {
  return (
    <>
      <h2>Step 5 of 6: Create Your Account</h2>
      <RoutingLinks
        previous={{ url: "/library-card/address-verification" }}
        next={{ url: "/library-card/review" }}
      />
    </>
  );
}

export default AccountPage;
