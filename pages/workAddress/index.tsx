import { Heading } from "@nypl/design-system-react-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useEffect } from "react";
import { GetServerSideProps } from "next";

import WorkAddressContainer from "../../src/components/WorkAddressContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import { useRouter } from "next/router";
import {
  generateNewCookieTokenAndHash,
  generateNewToken,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";
interface WorkAddressPageProps {
  hasUserAlreadyRegistered?: boolean;
  csrfToken: string;
}

function WorkAddressPage({
  hasUserAlreadyRegistered,
  csrfToken,
}: WorkAddressPageProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  });
  return (
    <>
      <Heading level="two">{t("location.workAddress.title")}</Heading>
      <p>{t("location.workAddress.description.part1")}</p>
      <p>{t("internationalInstructions")}</p>
      <WorkAddressContainer csrfToken={csrfToken} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const csrfToken = generateNewToken();
  const newTokenCookieString = generateNewCookieTokenAndHash(csrfToken);
  const tokenCookie = cookie.buildCookieHeader(newTokenCookieString);
  res.setHeader("Set-Cookie", [tokenCookie]);
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"];
  return {
    props: {
      csrfToken,
      hasUserAlreadyRegistered,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default WorkAddressPage;
