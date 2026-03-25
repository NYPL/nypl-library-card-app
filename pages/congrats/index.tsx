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
import { Paragraph } from "../../src/components/Paragraph";
import { Trans } from "../../src/components/Trans";
import { Banner } from "../../src/components/Banner";

const TEMPORARY_PTYPE = 7;

function ConfirmationPage({ nextAppEnv }: { nextAppEnv: string }): JSX.Element {
  const { state } = useFormDataContext();
  const formResults: FormResults = state.results;
  const { t } = useTranslation("common");
  // Render the temporary message in case there's no ptype, but this
  // shouldn't happen.
  const ptype = formResults?.ptype || TEMPORARY_PTYPE;
  const temporary = ptype === TEMPORARY_PTYPE;

  useEffect(() => {
    if (state.formValues.username) {
      const libraryName = ilsLibraryList.filter(
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

  const loginUrl = `https://${nextAppEnv === "qa" ? "dev-" : ""}login.nypl.org/auth/login?redirect_uri=https%3A%2F%2Fborrow.nypl.org%2F%3FopenAccount%3Dprofile`;

  return (
    <Box id="congratulations" mb="s">
      <PageHeading autoScrollOnMount mb="l">
        {t(`confirmation.title.${temporary ? "temporary" : "metro"}`)}
      </PageHeading>
      <ConfirmationGraphic />
      <Paragraph fontWeight="bold">
        {t("confirmation.description.part1")}
      </Paragraph>

      <Paragraph fontWeight="bold">
        <Trans i18nKey="confirmation.description.part2" />
      </Paragraph>

      {temporary && (
        <Banner content={<Trans i18nKey="confirmation.description.part3" />} />
      )}

      <PageHeading mt="l" lineHeight={"1!"}>
        {t("confirmation.nextSteps.title")}
      </PageHeading>

      {!temporary && (
        <NextSteps>
          <Trans i18nKey="confirmation.nextSteps.explore" />
        </NextSteps>
      )}

      <NextSteps>
        <Trans
          i18nKey="confirmation.nextSteps.borrow"
          values={{ loginUrl: loginUrl }}
        />
      </NextSteps>

      <NextSteps>
        <Trans i18nKey="confirmation.nextSteps.updates" />
      </NextSteps>

      <NextSteps>
        <Trans i18nKey="confirmation.nextSteps.more" />
      </NextSteps>
    </Box>
  );
}

const NextSteps = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paragraph sx={{ b: { display: "block", marginBottom: "xs" } }}>
      {children}
    </Paragraph>
  );
};

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
