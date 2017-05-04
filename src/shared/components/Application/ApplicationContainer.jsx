import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import ContentBanner from 'dgx-homepage-content-banner';
import LibraryCardForm from '../../containers/LibraryCardForm/LibraryCardForm';

const dummyBannerContent = {
  title: {
    type: 'text-group',
    en: {
      text: 'GET A LIBRARY CARD',
    },
  },
  description: {
    type: 'text-group',
    en: {
      text: 'Get free access to resources and services across all New York Public Library locations. With a library card, you can borrow library materials, reserve a computer, download digital media, and search hundreds of online magazines and databases.',
    },
  },
  image: {
    bannerImage: {
      'full-uri': 'https://d140u095r09w96.cloudfront.net/sites/default/files/get-a-library-card-banner.png',
      description: 'books centered on a bookshelf',
      alt: 'books centered on a bookshelf',
    },
    mobileBannerImage: {
      'full-uri': 'https://d140u095r09w96.cloudfront.net/sites/default/files/get-a-library-card-banner.png',
      description: 'books centered on a bookshelf',
      alt: 'books centered on a bookshelf',
    },
  },
};


class ApplicationContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      bannerStatus: false,
    }
  };

  updateBannerDisplay(bannerStatus) {
    this.setState({bannerStatus: bannerStatus});
  }

  render() {
    
    return (<div className="nypl-library-card-app">
        <Header
          skipNav={{ target: 'main-content' }}
          navData={navConfig.current}
        />
        <section id="main-content" className="main-content">
          {
            this.state.bannerStatus ?
              null :
              <ContentBanner className="nypl-library-card-banner"
                             items={[dummyBannerContent]} />
          }
          <LibraryCardForm initialBannerStatus={this.state.bannerStatus}
                           updateBannerDisplay={(bannerStatus) => this.updateBannerDisplay(bannerStatus)}/>
        </section>
        <Footer />
      </div>
    );
  }
}

export default ApplicationContainer;
