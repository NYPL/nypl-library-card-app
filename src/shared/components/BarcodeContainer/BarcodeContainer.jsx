import React from 'react';
import { Header, navConfig, utils } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

class BarcodeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      barcodeSrc: '',
    }
  };

  componentDidMount() {
    // Checks if "nyplIdentityPatron" cookie exists.
    this.getOAuthAccessToken('nyplIdentityPatron');
  }

  getOAuthAccessToken(cookie) {
    if (utils.hasCookie(cookie)) {
      this.setState({ accessToken: JSON.parse(utils.getCookie(cookie)).access_token || '' });
    }

    // make OAuth call to get cookie
  }

  render() {
    return (
      <div className="nypl-library-card-app">
        <Header
          skipNav={{ target: 'main-content' }}
          navData={navConfig.current}
        />
        <section id="main-content" className="main-content">
          <div className="barcode-container">
            <div className="get-card-message">
            </div>
          </div>
          <img src={this.state.barcodeSrc} alt="barcode" />
        </section>
        <Footer />
      </div>
    );
  }
}

export default BarcodeContainer;
