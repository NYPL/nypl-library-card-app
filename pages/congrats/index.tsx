/* eslint-disable jsx-a11y/anchor-is-valid */
import { Box, Heading } from "@nypl/design-system-react-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, { JSX, useEffect } from "react";
import { GetServerSideProps } from "next";

import ConfirmationGraphic from "../../src/components/ConfirmationGraphic";
import useFormDataContext from "../../src/context/FormDataContext";
import { FormResults } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";
import { appEnv, cookieDomain } from "../../appConfig";
import * as cookie from "../../src/utils/CookieUtils";

import ilsLibraryList from "../../src/data/ilsLibraryList";

function ConfirmationPage({ nextAppEnv }: { nextAppEnv: string }): JSX.Element {
  const { state } = useFormDataContext();
  const formResults: FormResults = state.results;
  const { t } = useTranslation("common");
  // Render the temporary message in case there's no ptype, but this
  // shouldn't happen.
  const ptype = formResults?.ptype || 7;
  const temporary = ptype === 7;
  useEffect(() => {
    if (state.formValues.username) {
      const libraryName: any = ilsLibraryList.filter(
        (library) => library.value === state.formValues.homeLibraryCode
      );
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "library_card_submission",
        nypl_location: libraryName[0]?.label || "E-branch (default)",
        location_id: state.formValues.homeLibraryCode || "eb",
      });
    }
  }, []);

  const loginHtml =
    nextAppEnv === "qa"
      ? t("confirmation.nextSteps.borrow").replace("https://", "https://dev-")
      : t("confirmation.nextSteps.borrow");

  console.info(nextAppEnv);
  console.info(appEnv);
  console.log(process.env.NEXT_PUBLIC_APP_ENV);
  console.info("NEXT_PUBLIC_ env vars:");
  try {
    for (const [k, v] of Object.entries(process?.env)) {
      if (k.includes("NEXT_PUBLIC")) {
        console.info(k, ": ", v);
      }
    }
  } catch (e) {
    console.log("process.env lookup crashed", e);
  }

  return (
    <Box id="congratulations" margin-bottom="10px">
      <Heading margin-bottom="10px">{t("confirmation.title")}</Heading>
      <ConfirmationGraphic />
      <Box mb="s">
        <b>{t("confirmation.description.part1")}</b>
      </Box>
      <Box mb="s">
        <b
          dangerouslySetInnerHTML={{
            __html: t("confirmation.description.part2"),
          }}
        />
      </Box>

      {temporary && (
        <Box
          dangerouslySetInnerHTML={{
            __html: t("confirmation.description.part3"),
          }}
        />
      )}

      <Heading>{t("confirmation.nextSteps.title")}</Heading>
      <Box
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.explore"),
        }}
      />
      <Box
        dangerouslySetInnerHTML={{
          __html: loginHtml,
        }}
      />
      <Box
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.updates"),
        }}
      />
      <Box
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.more"),
        }}
      />
    </Box>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  res,
}) => {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const csrfTokenName = cookie.metadata().csrfToken.name;
  res.setHeader("Set-Cookie", [
    `nyplUserRegistered=true; Max-Age=600; path=/; domain=${cookieDomain};`,
    // delete csrf token cookie after successful registration
    `${csrfTokenName}=; Max-Age=-1; path=/; domain=${cookieDomain};`,
  ]);
  return {
    props: {
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
      nextAppEnv: process.env.NEXT_PUBLIC_APP_ENV,
    },
  };
};

export default ConfirmationPage;
