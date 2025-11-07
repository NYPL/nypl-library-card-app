import { useEffect, useRef } from "react";
import { Heading } from "@nypl/design-system-react-components";

/**
 * PageHeading component that's used for the main heading component on each page
 */
export const PageHeading = ({ children, ...rest }) => {
  const headingRef = useRef(null);

  useEffect(() => {
    // Delay forced scroll to ensure new content is rendered before scrolling
    const scrollDelay = setTimeout(() => {
      if (headingRef.current) {
        headingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
    return () => clearTimeout(scrollDelay);
  }, []);

  return (
    <Heading ref={headingRef} level="h2" mb="s" size="heading3" {...rest}>
      {children}
    </Heading>
  );
};
