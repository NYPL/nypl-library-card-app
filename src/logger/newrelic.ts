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
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const newrelic = require("newrelic");
    newrelic.noticeError(e, customAttributes);
  } else {
    window.newrelic.noticeError(e, customAttributes);
  }
};
