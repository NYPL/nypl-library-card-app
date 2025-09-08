type CustomAttribute = Record<string, string | number>;

export const NRError = (
  e: Error,
  {
    customAttributes,
  }: {
    customAttributes?: CustomAttribute;
  } = {}
) => {
  customAttributes = {
    ...customAttributes,
    Error: JSON.stringify({
      ...e,
    }),
  };

  // Send to new relic dashboard
  if (typeof window === "undefined") {
    const newrelic = require("newrelic");
    newrelic.noticeError(e, customAttributes);
  } else if (
    typeof window.newrelic !== "undefined" &&
    typeof window.newrelic.noticeError !== "undefined"
  ) {
    window.newrelic.noticeError(e, customAttributes);
  } else {
    // This should never happen, adding this for the test environments
    console.info("New Relic Instance is missing.");
  }
};
