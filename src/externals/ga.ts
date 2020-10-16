import ga from "react-ga";

/**
 * getGoogleGACode
 * Return the Google Analytics code for the production property if isProd is
 * true, or the dev property if isProd is false
 */
const getGoogleGACode = (isProd: boolean) => {
  const codes = {
    production: "UA-1420324-3",
    dev: "UA-1420324-122",
  };
  return isProd ? codes.production : codes.dev;
};

function GaUtils() {
  /**
   * initilize(id, gaOpts = { debug: false, titleCase: false })
   *
   * @param {id} String GA ID.
   * @param {gaOpts} Object Configurations for GA initialization.
   */
  this.initialize = (id, gaOpts = { debug: false, titleCase: false }) => {
    if (!id) {
      return;
    }

    ga.initialize(id, gaOpts);
  };

  /**
   * trackEvent(category)
   * Create a function to track a specific category of GA events. A convenience
   * function so that `category`, which doens't change, doesn't have to be
   * added every time.
   *
   * @param {category} String Category for GA event.
   * @returns {function} Returns a function with the category set.
   *  Then you pass in the action and the label.
   */
  this.trackEvent = (category) => (action, label, value) =>
    ga.event({
      category,
      action,
      label,
      value,
    });

  /**
   * setDimension(dimensionIndex, dimensionValue)
   * Set the dimension for GA. Every dimension includes two properties:
   * the index and the value.
   * First set the dimension in the admin of GA's dashboard
   * so the value could be passed to it.
   *
   * @param {dimensionIndex} String
   * @param {dimensionValue} String
   * @returns {function} Returns a function with the dimension set.
   */
  this.setDimension = (dimensionIndex = "", dimensionValue = "") =>
    ga.set({ [dimensionIndex]: dimensionValue });

  /**
   * setDimensions(dimensions)
   * Set multiple dimensions for GA at once. Each dimension includes two properties:
   * the index and the value.
   * This function takes an array as the argument, the structure will be as such
   * [{ index: index1, value: value1 }, { index: index2, value: value2 }, ...]
   *
   * @param {dimensions} Array
   */
  this.setDimensions = (dimensions) => {
    dimensions.forEach((d) => {
      if (d.index && d.value) {
        ga.set({ [d.index]: d.value });
      }
    });
  };

  /**
   * trackPageview(url)
   * Track a GA pageview.
   *
   * @param {url} String
   * @returns {function} Returns a function.
   */
  this.trackPageview = (url) => ga.pageview(url);
}

const gaUtils = new GaUtils();

/**
 * setupAnalytics
 * Sets up Google Analytics if it's not already set up. Also initializes
 * page view tracking.
 */
const setupAnalytics = (windowGA, nodeEnv) => {
  if (!windowGA) {
    const isProd = nodeEnv === "production";
    const gaOpts = { debug: !isProd, titleCase: false };

    gaUtils.initialize(getGoogleGACode(isProd), gaOpts);
  }

  gaUtils.trackPageview(window.location.pathname);
};

export { setupAnalytics, gaUtils };
