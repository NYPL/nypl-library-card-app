import React from "react";
import RoutingLinks from "../../../src/components/RoutingLinks.tsx";

function HomePage() {
  return (
    <>
      <h2>Apply for a Library Card Online</h2>
      <p>
        Complete this application in just a few quick and easy steps to receive
        a digital library card. With this card, you’ll gain access to a wide
        array of digital resources—including e-books, databases, educational
        resources, and more—plus borrow materials through our temporary
        grab-and-go service. At this time, we are not issuing physical library
        cards.
      </p>
      <p>
        <b>Please note</b>: School groups, educators, patrons who need books by
        mail, and organizational borrowers should download the appropriate
        library card application form. Children who are 12 years old or younger
        can be provided a digital library card by their parent or guardian via
        our e-reader app{" "}
        <a href="https://www.nypl.org/books-music-movies/ebookcentral/simplye">
          SimplyE
        </a>
        .
      </p>
      <p>
        By submitting an application, you understand and agree to our{" "}
        <a href="https://www.nypl.org/help/library-card/terms-conditions">
          Cardholder Terms and Conditions
        </a>{" "}
        and agree to our{" "}
        <a href="https://www.nypl.org/help/about-nypl/legal-notices/rules-and-regulations">
          Rules and Regulations
        </a>
        . To learn more about The Library’s use of personal information, please
        read our{" "}
        <a href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>

      <RoutingLinks
        next={{
          url: "/library-card/personal?newCard=true",
          text: "Get Started",
        }}
      />
    </>
  );
}

export default HomePage;
