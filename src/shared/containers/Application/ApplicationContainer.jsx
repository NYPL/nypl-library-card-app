import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import LibraryCardForm from '../../components/LibraryCardForm/LibraryCardForm';

const ApplicationContainer = () => (
  <div className="nyplLibCardApp">
    <Header
      skipNav={{ target: 'mainContent' }}
      navData={navConfig.current}
    />
    <div id="mainContent">
      <LibraryCardForm />
    </div>
    <Footer
      id="footer"
      className="footer"
    />
  </div>
);

export default ApplicationContainer;
