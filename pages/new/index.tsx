import React, { useEffect } from "react";
import { Heading } from "@nypl/design-system-react-components";
import RoutingLinks from "../../src/components/RoutingLinks.tsx";
import useFormDataContext from "../../src/context/FormDataContext";
import { getCsrfToken } from "../../src/utils/utils";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import Link from "next/link";

function HomePage({ policyType, csrfToken }) {
  const router = useRouter();
  const { t } = useTranslation("common");
  const { dispatch } = useFormDataContext();
  // When the app loads, get the CSRF token from the server and set it in
  // the app's state.
  useEffect(() => {
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
      <Link href="/new" locale={router.locale === "en" ? "es" : "en"}>
        Spanish/English
      </Link>

      <Heading level={2}>{t("title")}</Heading>
      <p>{t("description.part1")}</p>
      <p>{t("description.part2")}</p>
      <div dangerouslySetInnerHTML={{ __html: t("description.part3") }} />

      <RoutingLinks
        next={{
          url: `/personal?newCard=true${queryParam}`,
          text: t("button"),
        }}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const { csrfToken } = getCsrfToken(context.req, context.res);
  return {
    props: {
      csrfToken,
      ...(await serverSideTranslations(context.locale, ["common"])),
    },
  };
}

export default HomePage;
