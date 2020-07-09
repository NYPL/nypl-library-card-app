/* eslint-env mocha */
import React from "react";
import { mount, shallow } from "enzyme";
import Banner, {
  defaultDescription,
  defaultHeadingText,
  defaultImageSrc,
} from "../src/components/Banner";
import { Hero } from "@nypl/design-system-react-components";

describe("Application", () => {
  it("should render a Design System Hero component", () => {
    const banner = shallow(<Banner />);

    expect(banner.find(Hero).length).toEqual(1);
  });

  it("should render the default text and image source", () => {
    const banner = mount(<Banner />);

    const bannerStyle = banner.find(".hero").prop("style");
    expect(banner.find("h1").text()).toEqual(defaultHeadingText);
    expect(bannerStyle.backgroundImage).toEqual(`url(${defaultImageSrc})`);
    expect(banner.find(".hero__body-text").text()).toEqual(defaultDescription);
  });

  it("should render optional props", () => {
    const fullImageSrc = "fake/image/url";
    const headingText = "test hero heading";
    const heroDescription = "test hero description";
    const banner = mount(
      <Banner
        fullImageSrc={fullImageSrc}
        heroDescription={heroDescription}
        headingText={headingText}
      />
    );

    const bannerStyle = banner.find(".hero").prop("style");
    expect(banner.find("h1").text()).toEqual(headingText);
    expect(bannerStyle.backgroundImage).toEqual(`url(${fullImageSrc})`);
    expect(banner.find(".hero__body-text").text()).toEqual(heroDescription);
  });
});
