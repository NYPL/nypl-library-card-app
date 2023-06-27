/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Link from "next/link";
import { useTranslation } from "next-i18next";

import { lcaEvents } from "../../externals/gaUtils";
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
}

/**
 * RoutingLinks
 * Renders two links that look like buttons to be used for routing. The
 * previous link is optional so it can be used on the starting page. A simple
 * approach to routing until submitting forms is integrated into routing.
 */
function RoutingLinks({ previous, next }: RoutingLinksType): JSX.Element {
  const { t } = useTranslation("common");
  const nextText = next.text || t("button.next");
  const previousText = previous?.text || t("button.previous");

  return (
    <div className={styles.container}>
      {previous?.url && (
        <Link href={previous.url}>
          <a
            className={styles.previous}
            onClick={() =>
              lcaEvents("Navigation", `Previous button to ${previous.url}`)
            }
          >
            {previousText}
          </a>
        </Link>
      )}
      {!next?.submit ? (
        <Link href={next.url}>
          <a
            className={`button ${styles.button}`}
            // Just track the "Get Started" or "Submit" clicks. Routing events
            // are tracked at the component level in each "onSubmit".
            onClick={() => {
              lcaEvents("Navigation", next.text);
              aaUtils.trackCtaEvent("Start Application", next.text, next.url);
            }}
          >
            {nextText}
          </a>
        </Link>
      ) : (
        <input
          className={`button ${styles.next}`}
          type="submit"
          value={nextText}
        />
      )}
    </div>
  );
}

export default RoutingLinks;
