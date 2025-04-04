/*
 * You MUST point the browser to http://localhost:3000/library-card/new.
 * Do NOT point the browser to http://localhost:3000 with no route.
 * If you do, you will throw an error related to i18next.
 * */

import { useEffect } from "react";
import { Heading } from "@nypl/design-system-react-components";
import RoutingLinks from "../../src/components/RoutingLinks.tsx";
import useFormDataContext from "../../src/context/FormDataContext";
import {
  generateNewCookieTokenAndHash,
  generateNewToken,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";

import { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import LanguageMenu from "../../src/components/LanguageMenu/LanguageMenu";
import { cookieDomain } from "../../appConfig.js";

interface HomePageProps {
  policyType: any;
  csrfToken: any;
  lang: string;
}

function HomePage({ policyType, csrfToken, lang }: HomePageProps) {
  const { t } = useTranslation("common");
  const { dispatch, state } = useFormDataContext();
  // When the app loads, get the CSRF token from the server and set it in
  // the app's state.
  console.log("/new", csrfToken);
  useEffect(() => {
    dispatch({
      type: "SET_CSRF_TOKEN",
      value: csrfToken,
    });
  }, []);
  console.log(state);
  // If we get a new policy type from the home page, make sure it gets to the
  // form on the next page. Used for the no-js scenario.
  const queryParam = policyType ? `&policyType=${policyType}` : "";
  return (
    <>
      <LanguageMenu />

      <Heading level="two">{t("home.title")}</Heading>

      <p>{t("home.description.part1")}</p>
      <p>{t("home.description.part2")}</p>
      <p dangerouslySetInnerHTML={{ __html: t("home.description.part3") }} />
      <p dangerouslySetInnerHTML={{ __html: t("home.description.part4") }} />

      <RoutingLinks
        next={{
          url: `/personal?newCard=true${queryParam}${
            lang !== "en" ? `&lang=${lang}` : ""
          }`,
          text: t("button.start"),
        }}
      />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { query } = context;
  // always update csrf token on /new
  const csrfToken = generateNewToken();
  const newTokenCookieString = generateNewCookieTokenAndHash(csrfToken);
  const tokenCookie = cookie.buildCookieHeader(newTokenCookieString);

  const headers = [
    // reset cookie that would otherwise bump users out of the flow
    // to succcess page
    `nyplUserRegistered=false; Max-Age=-1; path=/; domain=${cookieDomain};`,
    tokenCookie,
  ];
  context.res.setHeader("Set-Cookie", headers);

  return {
    props: {
      csrfToken,
      lang: query?.lang || "en",
      // This allows this page to get the proper translations based
      // on the `lang=...` URL query param. Default to "en".
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default HomePage;
