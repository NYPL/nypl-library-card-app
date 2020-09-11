import ga from "react-ga";

// Account codes for Google Analytics for different environments
const Google = {
  // Return the Google Analytics code for the production property if
  // isProd is true, or the dev property if isProd is false
  code: (isProd: boolean) => {
    const codes = {
      production: "UA-1420324-3",
      dev: "UA-1420324-122",
    };

    return isProd ? codes.production : codes.dev;
  },
};

const config = {
  google: Google,
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
   * trackGeneralEvent(category, action, label, value)
   * Track a GA event.
   *
   * @param {category} String Category for GA event.
   * @param {action} String Action for GA event.
   * @param {label} String Label for GA event.
   * @param {value} String Value for GA event.
   */
  this.trackGeneralEvent = (category, action, label, value) =>
    ga.event({
      category,
      action,
      label,
      value,
    });

  /**
   * trackEvent(category)
   * Track a GA click event, wrapped in a curried function.
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

export default {
  gaUtils,
  config,
  ga,
};
