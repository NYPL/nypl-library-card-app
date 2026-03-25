import { Link } from "@nypl/design-system-react-components";
import { Trans as ITrans } from "next-i18next";

/**
 * <Trans /> wrapper from next-i18next.
 * This contains a few default components that we use in our translation strings, such as <a> for DS Link, <b> , and <br>
 */
export const Trans = (props: React.ComponentProps<typeof ITrans>) => {
  const { i18nKey, ...rest } = props;
  return (
    <ITrans
      i18nKey={i18nKey}
      components={{
        a: <Link variant="external" />,
        br: <br />,
        b: <b />,
      }}
      {...rest}
    />
  );
};
