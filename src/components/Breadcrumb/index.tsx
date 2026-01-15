import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";
import Link from "next/link";

const Breadcrumbs = () => {
  const breadcrumbsData = [
    { url: "https://www.nypl.org", text: "Home", replace: false },
    { url: "/new", text: "Get A Library Card", replace: true },
  ];
  return (
    <DSBreadcrumbs
      variant="booksAndMore"
      breadcrumbsData={breadcrumbsData}
      customLinkComponent={Link}
    />
  );
};

export default Breadcrumbs;
