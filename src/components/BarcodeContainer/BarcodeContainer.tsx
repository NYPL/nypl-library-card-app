import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import CookieUtils from '../../utils/CookieUtils';

interface BarcodeContainerState {
  accessToken: string;
  barcodeSrc: string;
}

/**
 * BarcodeContainer
 * TODO: This component wasn't used in the app and could be deleted. Will wait
 * on UI update to see whether to delete or not.
 */
class BarcodeContainer extends React.Component<{}, BarcodeContainerState> {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      barcodeSrc: '',
    };
  }

  componentDidMount() {
    // Checks if "nyplIdentityPatron" cookie exists.
    this.getOAuthAccessToken('nyplIdentityPatron');
  }

  /**
   * getOAuthAccessToken(cookieName)
   * Gets the access token we need for requesting the barcode.
   *
   * @param {string} cookieName - The name of the cookie that contains the access token.
   */
  getOAuthAccessToken(cookieName) {
    if (CookieUtils.hasCookie(cookieName)) {
      this.setState({
        accessToken: JSON.parse(CookieUtils.getCookie(cookieName)).access_token || '',
      });
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
