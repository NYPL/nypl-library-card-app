/* eslint-env mocha */
import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';
// Import the related functions
import { utils } from '@nypl/dgx-header-component';
// Import the component that is going to be tested
import BarcodeContainer from './../src/shared/components/BarcodeContainer/BarcodeContainer.jsx';
// Import mock data
import mockBarcode from './mockBarcode.js';

describe('BarcodeContainer', () => {
  describe('Before making API calls, <BarcodeContainer>', () => {
    let component;
    let getPatronCookie;

    before(() => {
      getPatronCookie = sinon.stub(BarcodeContainer.prototype, 'getPatronCookie')
        .withArgs('nyplIdentityPatron')
        .returns(true);

      component = mount(<BarcodeContainer />);
    });

    after(() => {
      // stubs don't have restore(), the way to restore them is go back to the original functions.
      // However, if the sutbs only use the methods that belong to spies, restore() will work.
      BarcodeContainer.prototype.getPatronCookie.restore();
    });

    it('should have <Header>, <Footer>, and <section>.', () => {
      expect(component.find('.nypl-library-card-app').find('Header')).to.have.length(1);
      expect(component.find('.nypl-library-card-app').find('Footer')).to.have.length(1);
      expect(component.find('.nypl-library-card-app').find('section')).to.have.length(1);
    });
    it('should have a <section> with the ID, "main-content".', () => {
      expect(component.find('.nypl-library-card-app').find('section').prop('id')).to.equal('main-content');
    });
    it('should have a <section> that contains a <div> with class "barcode-container"', () => {
      expect(component.find('section').find('.barcode-container')).to.have.length(1);
      expect(component.find('.barcode-container').type()).to.equal('div');
    });
    it('should have a <section> that contains a <div> with class "get-card-message"', () => {
      expect(component.find('.barcode-container').find('.get-card-message')).to.have.length(1);
      expect(component.find('.get-card-message').type()).to.equal('div');
    });
    it('should check if "nyplIdentityPatron" cookie exists', () => {
      expect(getPatronCookie.calledOnce).to.equal(true);
      getPatronCookie.alwaysCalledWithExactly('nyplIdentityPatron');
    });
  });

//   describe('If "nyplIdentityPatron" does not exist', () => {
//     it('should lead the user to OAuth log in page.');
//   });

//   describe('If "nyplIdentityPatron" exists but the access token is expired', () => {
//     it('should call the cookie refresh API endpoint.');
//     it('should log the patron out, if calling the refesh link fails');
//   });

//   describe('If "nyplIdentityPatron" exists with valid access token', () => {
//     describe('<BarcodeContainer> should make an API call to the barcode endpoint.');

//     describe('If the API call to the barcode endpoint fails', () => {
//       it('should have a <section> that contains a <div> with class "get-card-message"');
//       it('should have the state of "patronName" with the value of ""');
//       it('should have the state of "barcodeSrc" with a value of ""');
//       it('should have the state of "barcodeNumber" with a value of ""');
//     });

//     describe('If the API call to the barcode endpoint successes', () => {
//       describe('but no valid "barcodeSrc" value', () => {
//         it('should have a <section> contains a <p> with class "patron-name"');
//         it('should have a <section> that contains a <div> with class "get-card-message"');
//         it('should have the state of "patronName" with the value of "Stewart, Darren"');
//         it('should have the state of "barcodeSrc" with a value of ""');
//         it('should have the state of "barcodeNumber" with a value of ""');
//       });

//       describe('with valid "barcodeSrc" value', () => {
//         it('should have a <section> contains a <p> with class "patron-name"');
//         it('should have a <section> contains a <img> with class "barcode-image"');
//         it('should have a <section> contains a <p> with class "barcode-number"');
//         it('should have the state of "patronName" with the value of "Stewart, Darren"');
//         it('should have the state of "barcodeSrc" with a value');
//         it('should have the state of "barcodeNumber" with a value of "25553095887111"');
//       });
//     });
//   });
});


// describe('Barcode', () => {
//   describe('<Barcode> as default without any value of its prop "barcodeSrc"', () => {
//     let component;

//     before(() => {
//       component = mount(<Barcode />);
//     });

//     it('shuld have a <div> with the class name "Barcode" as a wrapper', () => {
//       expect(component.find('div')).to.have.length(1);
//       expect(component.find('.Barcode').type()).to.equal('div');
//     });

//     it('shuld have a <p> with the class name "Barcode-Title". ' +
//       'Its text is "Your barcode is not availble."', () => {
//       expect(component.find('.Barcode').find('p')).to.have.length(1);
//       expect(component.find('.Barcode-Title').type()).to.equal('p');
//       expect(component.find('.Barcode-Title').text()).to.equal(
//         'Your barcode is not availble.'
//       );
//     });
//   });

//   describe('<Barcode> with a valid value of its prop "barcodeSrc" and "className"', () => {
//     let component;

//     before(() => {
//       component = mount(<Barcode className="MobileMyNypl-Barcode" barcodeSrc={mockBarcode.src} />);
//     });

//     it('shuld have a <div> with class name "MobileMyNypl-Barcode" as a wrapper', () => {
//       expect(component.find('div')).to.have.length(1);
//       expect(component.find('.MobileMyNypl-Barcode').type()).to.equal('div');
//     });

//     it('shuld have a <p> with class name "Barcode-Title". ' +
//       'Its text is "Your barcode is:"', () => {
//       expect(component.find('.MobileMyNypl-Barcode').find('p')).to.have.length(1);
//       expect(component.find('.Barcode-Title').type()).to.equal('p');
//       expect(component.find('.Barcode-Title').text()).to.equal(
//         'Your barcode is:');
//     });

//     it('shuld have a <img> with class name "Barcode-Image". ' +
//       'Its "src" property should be the same as the prop "barcodeSrc"', () => {
//       expect(component.find('.MobileMyNypl-Barcode').find('img')).to.have.length(1);
//       expect(component.find('.Barcode-Image').type()).to.equal('img');
//       expect(component.find('.Barcode-Image').prop('src')).to.equal(mockBarcode.src);
//     });

//     it('shuld have a <img> with its src property set to a Base64 encoded PNG', () => {});
//     it('shuld have a <img> with its alt property set to be "This is your barcode"', () => {
//       expect(component.find('.Barcode-Image').prop('alt')).to.equal('This is your barcode');
//     });
//   });
// });
