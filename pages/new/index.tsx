import React, { useEffect } from "react";
// import axios from "axios";
// import asyncUseEffect from "use-async-effect";

import RoutingLinks from "../../src/components/RoutingLinks.tsx";
import useFormDataContext from "../../src/context/FormDataContext";
import { getCsrfToken } from "../../src/utils/api";

function HomePage({ policyType, csrfToken }) {
  const { dispatch } = useFormDataContext();
  console.log("homepage otken", csrfToken);
  useEffect(() => {
    // const token = await getCsrfToken2();
    // console.log("HomePage token", token);
    dispatch({
      type: "SET_CSRF_TOKEN",
      value: csrfToken,
    });
  }, []);

  // If we get a new policy type from the home page, make sure it gets to the
  // form on the next page. Used for the no-js scenario.
  const queryParam = policyType ? `&policyType=${policyType}` : "";
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
          url: `/personal?newCard=true${queryParam}`,
          text: "Get Started",
        }}
      />
    </>
  );
}

// const _fetchData = async (url, options = {}) => {
//   return axios
//     .post(`http://localhost:3000${url}`, options)
//     .then((response) => {
//       const data = response.data;
//       return Promise.resolve(Object.keys(data).length > 0 ? data : null);
//     })
//     .catch((error) => {
//       console.log("error calling csrf endpoing", error);
//       return Promise.resolve(null);
//     });
// };

// const getCsrfToken2 = async () => {
//   const data = await _fetchData("/library-card/api/csrf", {});
//   return data?.csrfToken ? data.csrfToken : null;
// };

export async function getServerSideProps(context) {
  const { csrfToken } = getCsrfToken(context.req, context.res);
  return {
    props: { csrfToken },
  };
}

export default HomePage;
