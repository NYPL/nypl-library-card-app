import { useEffect, useRef } from "react";
import { Heading } from "@nypl/design-system-react-components";

/**
 * PageHeading component that's used for the main heading component on each page
 */
export const PageHeading = ({ children, ...rest }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    // Delay scroll to ensure new content is rendered before scrolling
    const timer = setTimeout(() => {
      if (headingRef.current) {
        headingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Heading
      ref={headingRef}
      tabIndex={-1}
      level="h2"
      mb="s"
      size="heading3"
      {...rest}
    >
      {children}
    </Heading>
  );
};
