import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import LibraryCardForm from '../../containers/LibraryCardForm/LibraryCardForm';

const ApplicationContainer = () => (
  <div className="nyplLibCardApp">
    <Header
      skipNav={{ target: 'main-content' }}
      navData={navConfig.current}
    />
    <LibraryCardForm />
    <Footer />
  </div>
);

export default ApplicationContainer;
