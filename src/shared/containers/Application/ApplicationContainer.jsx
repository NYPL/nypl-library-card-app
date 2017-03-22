import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

class ApplicationContainer extends React.Component {
  render() {
    return (
      <div id="nyplLibraryCardApp" className="nyplLibraryCardApp">
        <Header skipNav={{ target: 'mainContent' }} navData={navConfig.current} />
        <div id="mainContent">
          <h1>Hello World!</h1>
        </div>
        <Footer id="footer" className="footer" />
      </div>
    );
  }
}

ApplicationContainer.propTypes = {
};

export default ApplicationContainer;
