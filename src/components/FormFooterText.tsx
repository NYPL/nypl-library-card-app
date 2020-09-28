import React from "react";
import { Link } from "@nypl/design-system-react-components";

/**
 * Hard-coded text that appears at the bottom of the form, after
 * the submit button.
 */
const FormFooterText = () => (
  <div>
    <h2>What to Expect Next</h2>
    <p>
      After you submit your application, you will see a confirmation page with a
      temporary account number, and you will be able to log in and request books
      and materials. To get your card, follow the confirmation page
      instructions. You may also apply in person at any{" "}
      <Link href="https://www.nypl.org/locations">library location</Link> in the
      Bronx, Manhattan, or Staten Island.
    </p>
    <h2>Applying in Person</h2>
    <p>
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#juv">
        Children 12 and under
      </Link>
      ,{" "}
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#download">
        classrooms and other groups
      </Link>
      ,&nbsp;
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#Educator%20Cards">
        educators
      </Link>
      ,{" "}
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#homebound">
        homebound individuals
      </Link>
      , and{" "}
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#organizational">
        organizational
      </Link>{" "}
      borrowers should apply in person or download the appropriate{" "}
      <Link href="https://www.nypl.org/help/library-card/terms-conditions#download">
        library card application form
      </Link>
      .
    </p>
    <h2>Learn More</h2>
    <p>
      <Link href="https://www.nypl.org/help/library-card/terms-conditions">
        Who is eligible for an NYPL card?
      </Link>
    </p>
    <p>
      <Link href="https://www.nypl.org/help/library-card#renew">
        How to validate or renew your NYPL card
      </Link>
    </p>
  </div>
);

export default FormFooterText;
