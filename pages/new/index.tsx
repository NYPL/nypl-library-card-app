import React, { useEffect } from "react";
import { Heading } from "@nypl/design-system-react-components";
import IPLocationAPI from "../../src/utils/IPLocationAPI";
import RoutingLinks from "../../src/components/RoutingLinks.tsx";
import useFormDataContext from "../../src/context/FormDataContext";
import { getCsrfToken } from "../../src/utils/utils";

function HomePage({ policyType, csrfToken, location }) {
  const { state, dispatch } = useFormDataContext();
  const { formValues } = state;
  // When the app loads, get the CSRF token from the server and set it in
  // the app's state.
  // Update the form values state with the user's location value.
  useEffect(() => {
    dispatch({
      type: "SET_CSRF_TOKEN",
      value: csrfToken,
    });
    console.log("use effect", location);
    dispatch({
      type: "SET_FORM_DATA",
      value: { ...formValues, location },
    });
  }, []);

  // If we get a new policy type from the home page, make sure it gets to the
  // form on the next page. Used for the no-js scenario.
  const queryParam = policyType ? `&policyType=${policyType}` : "";
  return (
    <>
      <Heading level={2}>
        Get a Digital Library Card Today in a Few Easy Steps
      </Heading>
      <p>
        If you are 13 or older and live, work, attend school, or pay property
        taxes in New York State, you can get a free digital library card right
        now using this online form. Visitors to New York State can also use this
        form to apply for a temporary card.
      </p>
      <p>
        With a digital library card you get free access to the Library’s wide
        array of digital resources—including e-books, databases, educational
        resources, and more.
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
        . To learn more about the Library’s use of personal information, please
        read our{" "}
        <a href="https://www.nypl.org/help/about-nypl/legal-notices/privacy-policy">
          Privacy Policy
        </a>
        .
      </p>

      <RoutingLinks
        next={{
          url: `/personal?newCard=true${queryParam}`,
          text: "Get Started",
        }}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  // Get the user's IP address and convert it to an object that tells us if
  // the user is in NYS/NYC. Will be `undefined` if the call to the IP/location
  // conversion API fails or if there is no IP address.
  let location = "";
  if (context.req?.headers) {
    location = await IPLocationAPI.getLocationFromIP(context);
  }
  const { csrfToken } = getCsrfToken(context.req, context.res);
  return {
    props: { csrfToken, location },
  };
}

export default HomePage;
