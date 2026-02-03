import { Box } from "@nypl/design-system-react-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, { JSX, useEffect } from "react";
import { GetServerSideProps } from "next";

import ConfirmationGraphic from "../../src/components/ConfirmationGraphic";
import useFormDataContext from "../../src/context/FormDataContext";
import { FormResults } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";
import { cookieDomain } from "../../appConfig";
import * as cookie from "../../src/utils/CookieUtils";

import ilsLibraryList from "../../src/data/ilsLibraryList";
import { PageHeading } from "../../src/components/PageHeading";

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
        nypl_location: libraryName[0]?.label,
        location_id: state.formValues.homeLibraryCode,
      });
    }
  }, []);

  const loginHtml =
    nextAppEnv === "qa"
      ? t("confirmation.nextSteps.borrow").replace("https://", "https://dev-")
      : t("confirmation.nextSteps.borrow");

  return (
    <Box id="congratulations" mb="s">
      <PageHeading autoScrollOnMount>{t("confirmation.title")}</PageHeading>
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
          mb="s"
          dangerouslySetInnerHTML={{
            __html: t("confirmation.description.part3"),
          }}
        />
      )}

      <PageHeading mt="l">{t("confirmation.nextSteps.title")}</PageHeading>
      <Box
        mb="s"
        dangerouslySetInnerHTML={{
          __html: loginHtml,
        }}
      />
      <Box
        mb="s"
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.updates"),
        }}
      />
      <Box
        mb="s"
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
      nextAppEnv: process.env.NEXT_PUBLIC_APP_ENV || null,
    },
  };
};

export default ConfirmationPage;
