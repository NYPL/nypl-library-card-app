import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';

class BarcodeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barcodeSrc: '',
    }
  };

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
