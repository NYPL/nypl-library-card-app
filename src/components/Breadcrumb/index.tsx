import { Breadcrumbs as DSBreadcrumbs } from "@nypl/design-system-react-components";

const Breadcrumbs = () => {
  const breadcrumbsData = [
    { url: "https://www.nypl.org", text: "Home" },
    { url: null, text: "Get A Library Card" },
  ];
  return (
    <DSBreadcrumbs variant="booksAndMore" breadcrumbsData={breadcrumbsData} />
  );
};

export default Breadcrumbs;
