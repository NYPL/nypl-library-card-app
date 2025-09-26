import React, { JSX } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import aaUtils from "../../externals/aaUtils";
import {
  Box,
  Button,
  Link as DSLink,
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
  const nextText = next.text || t("button.next");
  const previousText = previous?.text || t("button.previous");

  return (
    <Box my="2rem" display="flex" gap="xs">
      {previous?.url && (
        <DSLink
          as={Link}
          href={previous.url}
          id="routing-links-previous"
          variant="buttonSecondary"
          borderColor="ui.gray.medium"
          _visited={{ color: "ui.gray.dark" }}
          _hover={{ color: "ui.gray.dark" }}
        >
          {previousText}
        </DSLink>
      )}
      {!next?.submit ? (
        <DSLink
          as={Link}
          href={next.url}
          id="routing-links-next"
          variant="buttonPrimary"
          // Just track the "Get Started" or "Submit" clicks. Routing events
          // are tracked at the component level in each "onSubmit".
          onClick={() => {
            aaUtils.trackCtaEvent("Start Application", next.text, next.url);
          }}
        >
          {nextText}
        </DSLink>
      ) : (
        <Button
          variant="primary"
          id="routing-links-next"
          disabled={isDisabled}
          type="submit"
        >
          {nextText}
        </Button>
      )}
    </Box>
  );
}

export default RoutingLinks;
