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

interface ReviewProps {
  hasUserAlreadyRegistered?: boolean;
}

function ReviewPage({ hasUserAlreadyRegistered }: ReviewProps) {
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
      <ReviewFormContainer />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  // We only want to get to this page from a form submission flow. If the page
  // is hit directly, then redirect to the home page.
  if (!query.newCard) {
    return homePageRedirect();
  }
  const hasUserAlreadyRegistered = !!req.cookies["nyplUserRegistered"];
  return {
    props: {
      hasUserAlreadyRegistered,
      ...(await serverSideTranslations(query?.lang?.toString() || "en", [
        "common",
      ])),
    },
  };
};

export default ReviewPage;
