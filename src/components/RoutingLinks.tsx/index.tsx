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

interface LinkButtonProps {
  text: string;
  url: string;
}

interface SubmitButtonProps {
  text: string;
  isDisabled: boolean;
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

  const nextElement = !next?.submit ? (
    <GetStartedButton text={nextText} url={next.url} />
  ) : (
    <NextButton text={nextText} isDisabled={isDisabled} />
  );

  return (
    <Box display="flex" gap="xs" flexDir={{ base: "column", md: "row" }}>
      {/* Next button will be placed on top on mobile view */}
      {isLargerThanLargeMobile ? (
        <>
          {previous?.url && (
            <PreviousLink text={previousText} url={previous.url} />
          )}
          {nextElement}
        </>
      ) : (
        <>
          {nextElement}
          {previous?.url && (
            <PreviousLink text={previousText} url={previous.url} />
          )}
        </>
      )}
    </Box>
  );
}

const GetStartedButton = ({ text, url }: LinkButtonProps) => (
  <DSLink
    as={Link}
    href={url}
    id="routing-links-next"
    variant="buttonPrimary"
    width={{ base: "100%", md: "auto" }}
  >
    {text}
  </DSLink>
);

const PreviousLink = ({ text, url }: LinkButtonProps) => (
  <DSLink
    as={Link}
    href={url}
    id="routing-links-previous"
    variant="buttonSecondary"
  >
    {text}
  </DSLink>
);

const NextButton = ({ text, isDisabled }: SubmitButtonProps) => (
  <Button
    variant="primary"
    id="routing-links-next"
    disabled={isDisabled}
    aria-disabled={isDisabled}
    type="submit"
  >
    {text}
  </Button>
);

export default RoutingLinks;
