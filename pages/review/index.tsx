import { Heading } from "@nypl/design-system-react-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import ReviewFormContainer from "../../src/components/ReviewFormContainer";
import {
  homePageRedirect,
  redirectIfUserHasRegistered,
} from "../../src/utils/utils";
import {
  generateNewCookieTokenAndHash,
  generateNewToken,
  parseTokenFromPostRequestCookies,
} from "../../src/utils/csrfUtils";
import * as cookie from "../../src/utils/CookieUtils";

interface ReviewProps {
  hasUserAlreadyRegistered?: boolean;
}

function ReviewPage({ hasUserAlreadyRegistered, csrfToken }: ReviewProps) {
  const { t } = useTranslation("common");
  const router = useRouter();
  useEffect(() => {
    redirectIfUserHasRegistered(hasUserAlreadyRegistered, router);
  }, []);
  return (
    <>
      <Heading level="two">{t("review.title")}</Heading>
      <p>{t("review.description")}</p>
      <p>{t("internationalInstructions")}</p>
      <ReviewFormContainer csrfToken={csrfToken} />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
  res,
}) => {
  const tokenFromRequestCookie = parseTokenFromPostRequestCookies(req);

  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  let newCsrfTokenCookieHeader;
  let csrfToken = tokenFromRequestCookie.value;

  if (!csrfToken) {
    csrfToken = generateNewToken();
    const newTokenCookieString = generateNewCookieTokenAndHash(csrfToken);
    newCsrfTokenCookieHeader = cookie.buildCookieHeader(newTokenCookieString);
    res.setHeader("set-cookie", [newCsrfTokenCookieHeader]);
  }
  console.log(csrfToken);

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

export default ReviewPage;
