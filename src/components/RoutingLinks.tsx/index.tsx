import React, { JSX } from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import aaUtils from "../../externals/aaUtils";
import styles from "./RoutingLinks.module.css";

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
    <div className={styles.container}>
      {previous?.url && (
        <Link
          href={previous.url}
          id="routing-links-previous"
          className={styles.previous}
        >
          {previousText}
        </Link>
      )}
      {!next?.submit ? (
        <Link
          href={next.url}
          id="routing-links-next"
          className={`button ${styles.button}`}
          // Just track the "Get Started" or "Submit" clicks. Routing events
          // are tracked at the component level in each "onSubmit".
          onClick={() => {
            aaUtils.trackCtaEvent("Start Application", next.text, next.url);
          }}
        >
          {nextText}
        </Link>
      ) : (
        <input
          id="routing-links-next"
          className={`button ${styles.next}`}
          disabled={isDisabled}
          type="submit"
          value={nextText}
        />
      )}
    </div>
  );
}

export default RoutingLinks;
