/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import ConfirmationGraphic from "../../src/components/ConfirmationGraphic";
import { Heading } from "@nypl/design-system-react-components";
import useFormDataContext from "../../src/context/FormDataContext";
import { FormResults } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";

function ConfirmationPage() {
  const { state } = useFormDataContext();
  const formResults: FormResults = state.results;
  // Render the temporary message in case there's no ptype, but this
  // shouldn't happen.
  const ptype = formResults?.ptype || 7;
  const temporary = ptype === 7;

  return (
    <div>
      <Heading level="two">
        Congratulations! You now have a digital New York Public Library card.
      </Heading>

      <ConfirmationGraphic />

      <p>
        <b>
          Print or save this information for your records. Within 24 hours, you
          will receive an email with the details of your account.
        </b>
      </p>

      <p>
        <b>
          To borrow physical materials, please visit one of our{" "}
          <a href="http://nypl.org/locations">locations</a> with a valid{" "}
          <a href="https://www.nypl.org/help/library-card/terms-conditions#Eligibility">
            photo ID and proof of address
          </a>{" "}
          to complete the application for a physical card.
        </b>
      </p>

      {temporary && (
        <p>
          This is a temporary card and will expire in 14 days. If you are a
          student in a New York–accredited college, an employee at a NYC company
          but not physically in the city or state, or a researcher who will be
          visiting one of our research centers, contact{" "}
          <a href="mailto:gethelp@nypl.org">gethelp@nypl.org</a> to update your
          card.
        </p>
      )}

      <Heading level="two">
        Get Started with The New York Public Library
      </Heading>
      <p>
        <b>Explore Library E-Books</b>
        <br />
        Download SimplyE for{" "}
        <a href="https://apps.apple.com/app/apple-store/id1046583900">
          iOS
        </a> or{" "}
        <a href="https://play.google.com/store/apps/details?id=org.nypl.simplified.simplye&referrer=utm_source%3Dnypl.org%26utm_medium%3Dreferral%26utm_content%3Dnypl_website_simplye2%26utm_campaign%3Dnypl_website_simplye2">
          Android
        </a>
        .
      </p>
      <p>
        <b>Borrow Books & More</b>
        <br />
        <a href="https://ilsstaff.nypl.org/iii/cas/login?service=http%3A%2F%2Fauth.nypl.org%2Fauthorize%3Fresponse_type%3Dcode%26client_id%3Dapp_myaccount%26scope%3Dopenid%2Boffline_access%2Bpatron%253Aread%26redirect_uri%3Dhttps%253A%252F%252Flogin.nypl.org%252Fauth%252Flogin%26state%3DeyJyZWRpcmVjdF91cmkiOiJodHRwczpcL1wvYnJvd3NlLm55cGwub3JnXC9paWlcL2VuY29yZVwvbXlhY2NvdW50In0%253D">
          Log into your account
        </a>{" "}
        and browse the catalog.
      </p>
      <p>
        <b>Get Updates</b>
        <br />
        <a href="https://www.nypl.org/enews">
          Find out about all the Library has to offer.
        </a>
      </p>
      <p>
        <b>Learn More</b>
        <br />
        <a href="https://www.nypl.org/discover-library-card">
          Discover everything you can do with your library card.
        </a>
      </p>
    </div>
  );
}

export async function getServerSideProps({ query }) {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  return { props: {} };
}

export default ConfirmationPage;
