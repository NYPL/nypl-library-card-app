import {
  Box,
  Banner as DSBanner,
  Icon,
} from "@nypl/design-system-react-components";

interface BannerProps {
  content: string | React.ReactElement;
}

export const Banner = ({ content }: BannerProps) => {
  return (
    <Box my="l">
      <DSBanner
        color="ui.typography.body"
        content={content}
        icon={
          <Icon
            decorative
            name="actionInfo"
            title="Banner with informative icon"
            size="large"
            marginTop="xxxs"
          />
        }
        variant="informative"
      />
    </Box>
  );
};
