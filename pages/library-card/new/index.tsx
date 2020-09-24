import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

function HomePage() {
  return (
    <>
      <h2>Apply for a Library Card Online</h2>
      <p>Lorem ipsum</p>

      <RoutingLinks
        next={{
          url: "/library-card/location?newCard=true",
          text: "Get Started",
        }}
      />
    </>
  );
}

export default HomePage;
