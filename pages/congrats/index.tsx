/* eslint-disable jsx-a11y/anchor-is-valid */
import { Heading } from "@nypl/design-system-react-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import React, { useEffect } from "react";
import { GetServerSideProps } from "next";

import ConfirmationGraphic from "../../src/components/ConfirmationGraphic";
import useFormDataContext from "../../src/context/FormDataContext";
import { FormResults } from "../../src/interfaces";
import { homePageRedirect } from "../../src/utils/utils";
import { cookieDomain } from "../../appConfig";
import ilsLibraryList from "../../src/data/ilsLibraryList";

function ConfirmationPage(): JSX.Element {
  const { state } = useFormDataContext();
  const formResults: FormResults = state.results;
  const { t } = useTranslation("common");
  // Render the temporary message in case there's no ptype, but this
  // shouldn't happen.
  const ptype = formResults?.ptype || 7;
  const temporary = ptype === 7;
  useEffect(() => {
    if (state.formValues.username) {
      (window as any).dataLayer = (window as any).dataLayer || [];
      (window as any).dataLayer.push({
        event: "library_card_submission",
        nypl_location: ilsLibraryList[state.formValues.homeLibraryCode],
      });
    }
  }, []);

  return (
    <div>
      <Heading level="two">{t("confirmation.title")}</Heading>
      <ConfirmationGraphic />
      <p>
        <b>{t("confirmation.description.part1")}</b>
      </p>
      <p>
        <b
          dangerouslySetInnerHTML={{
            __html: t("confirmation.description.part2"),
          }}
        />
      </p>

      {temporary && (
        <div
          dangerouslySetInnerHTML={{
            __html: t("confirmation.description.part3"),
          }}
        />
      )}

      <Heading level="two">{t("confirmation.nextSteps.title")}</Heading>
      <div
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.explore"),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.borrow"),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.updates"),
        }}
      />
      <div
        dangerouslySetInnerHTML={{
          __html: t("confirmation.nextSteps.more"),
        }}
      />
    </div>
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
  res.setHeader(
    "Set-Cookie",
    `nyplUserRegistered=true; Max-Age=600; path=/; domain=${cookieDomain};`
  );
  return {
    props: {
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default ConfirmationPage;
