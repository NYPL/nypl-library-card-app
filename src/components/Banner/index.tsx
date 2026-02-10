import {
  Box,
  Banner as DSBanner,
  Icon,
} from "@nypl/design-system-react-components";

interface BannerProps {
  content: Element | string | React.ReactElement;
}

const Banner = ({ content }: BannerProps) => {
  return (
    <Box my="l">
      <DSBanner
        color="ui.typography.body"
        content={content}
        icon={
          <Icon
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

export default Banner;
