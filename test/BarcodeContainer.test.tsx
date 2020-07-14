/** eslint-disable */
import React from "react";
import sinon from "sinon";
import { mount } from "enzyme";
// Import the related functions
import CookieUtils from "./../src/utils/CookieUtils.js";
// Import the component that is going to be tested
import BarcodeContainer from "./../src/components/BarcodeContainer/BarcodeContainer";
// Import mock data
import mockBarcodeContainerTestData from "./mockBarcodeContainerTestData.js";

describe.skip("BarcodeContainer", () => {
  describe("Before making API calls for barcodes, <BarcodeContainer>", () => {
    let component;
    let getOAuthAccessToken;

    beforeAll(() => {
      getOAuthAccessToken = sinon
        .stub(BarcodeContainer.prototype, "getOAuthAccessToken")
        .withArgs("nyplIdentityPatron");

      component = mount(<BarcodeContainer />);
    });

    afterAll(() => {
      // stubs don't have restore(), the way to restore them is go back to the original functions.
      // However, if the sutbs only use the methods that belong to spies, restore() will work.
      getOAuthAccessToken.restore();
    });

    it("should have <Header>, <Footer>, and <section>.", () => {
      expect(
        component.find(".nypl-library-card-app").find("Header")
      ).to.have.length(1);
      expect(
        component.find(".nypl-library-card-app").find("Footer")
      ).to.have.length(1);
      expect(
        component.find(".nypl-library-card-app").find("section")
      ).to.have.length(1);
    });
    it('should have a <section> with the ID, "main-content".', () => {
      expect(
        component.find(".nypl-library-card-app").find("section").prop("id")
      ).to.equal("main-content");
    });
    it('should have a <section> that contains a <div> with class "barcode-container"', () => {
      expect(
        component.find("section").find(".barcode-container")
      ).to.have.length(1);
      expect(component.find(".barcode-container").type()).to.equal("div");
    });
    it('should have a <section> that contains a <div> with class "get-card-message"', () => {
      expect(
        component.find(".barcode-container").find(".get-card-message")
      ).to.have.length(1);
      expect(component.find(".get-card-message").type()).to.equal("div");
    });
    it('should try to get the "access_token" from the "nyplIdentityPatron" cookie', () => {
      expect(getOAuthAccessToken.calledOnce).to.equal(true);
      getOAuthAccessToken.alwaysCalledWithExactly("nyplIdentityPatron");
    });
  });
});
