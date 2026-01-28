import React, { JSX } from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import {
  Box,
  Button,
  Link as DSLink,
  useNYPLBreakpoints,
} from "@nypl/design-system-react-components";

export interface LinkType {
  url: string;
  text?: string;
}

export interface RoutingLinksType {
  previous?: LinkType;
  // We only want an optional "submit" property for the next prop.
  // The "url" and "text" props are not needed if "submit" is passed.
  next: Partial<LinkType> & { submit?: boolean };
  isDisabled?: boolean;
}

/**
 * RoutingLinks
 * Renders two links that look like buttons to be used for routing. The
 * previous link is optional so it can be used on the starting page. A simple
 * approach to routing until submitting forms is integrated into routing.
 */
function RoutingLinks({
  previous,
  next,
  isDisabled = false,
}: RoutingLinksType): JSX.Element {
  const { t } = useTranslation("common");
  const { isLargerThanLargeMobile } = useNYPLBreakpoints();
  const nextText = next.text || t("button.next");
  const previousText = previous?.text || t("button.previous");

  const GetStartedButton = () => (
    <DSLink
      as={Link}
      href={next.url}
      id="routing-links-next"
      variant="buttonPrimary"
      width={{ base: "100%", md: "auto" }}
    >
      {nextText}
    </DSLink>
  );

  const PreviousLink = () => (
    <DSLink
      as={Link}
      href={previous.url}
      id="routing-links-previous"
      variant="buttonSecondary"
    >
      {previousText}
    </DSLink>
  );

  const NextButton = () => (
    <Button
      variant="primary"
      id="routing-links-next"
      disabled={isDisabled}
      aria-disabled={isDisabled}
      type="submit"
    >
      {nextText}
    </Button>
  );

  const nextElement = !next?.submit ? <GetStartedButton /> : <NextButton />;

  return (
    <Box
      mt="2rem"
      display="flex"
      gap="xs"
      flexDir={{ base: "column", md: "row" }}
    >
      {/* Next button will be placed on top on mobile view */}
      {isLargerThanLargeMobile ? (
        <>
          {previous?.url && <PreviousLink />}
          {nextElement}
        </>
      ) : (
        <>
          {nextElement}
          {previous?.url && <PreviousLink />}
        </>
      )}
    </Box>
  );
}

export default RoutingLinks;
