/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import Link from "next/link";
import styles from "./RoutingLinks.module.css";

export interface LinkType {
  url: string;
  text?: string;
}

export interface RoutingLinksType {
  previous?: LinkType;
  next: LinkType;
}

/**
 * RoutingLinks
 * Renders two links that look like buttons to be used for routing. The
 * previous link is optional so it can be used on the starting page. A simple
 * approach to routing until submitting forms is integrated into routing.
 */
function RoutingLinks({ previous, next }: RoutingLinksType): JSX.Element {
  return (
    <div className={styles.container}>
      {previous?.url && (
        <Link href={previous.url} passHref>
          <a className={styles.previous}>{previous.text || "Previous"}</a>
        </Link>
      )}
      <Link href={next.url} passHref>
        <a className="button">{next.text || "Next"}</a>
      </Link>
    </div>
  );
}

export default RoutingLinks;
