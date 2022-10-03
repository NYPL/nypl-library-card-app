import React, { useEffect } from "react";
import { Heading } from "@nypl/design-system-react-components";
import RoutingLinks from "../../src/components/RoutingLinks.tsx";
import useFormDataContext from "../../src/context/FormDataContext";
import { getCsrfToken } from "../../src/utils/utils";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LanguageMenu from "../../src/components/LanguageMenu/LanguageMenu";

function HomePage({ policyType, csrfToken, lang }) {
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
      <Heading level="two">{t("home.title")}</Heading>
      <p>{t("home.description.part1")}</p>
      <p>{t("home.description.part2")}</p>
      <div dangerouslySetInnerHTML={{ __html: t("home.description.part3") }} />

      <RoutingLinks
        next={{
          url: `/personal?newCard=true${queryParam}${
            lang !== "en" ? `&lang=${lang}` : ""
          }`,
          text: t("home.button"),
        }}
      />

      <LanguageMenu />
    </>
  );
}

export async function getServerSideProps(context) {
  const { csrfToken } = getCsrfToken(context.req, context.res);
  const { query } = context;

  return {
    props: {
      csrfToken,
      lang: query?.lang || "en",
      // This allows this page to get the proper translations based
      // on the `lang=...` URL query param. Default to "en".
      ...(await serverSideTranslations(query?.lang || "en", ["common"])),
    },
  };
}

export default HomePage;
