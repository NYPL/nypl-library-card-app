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
      'full-uri': 'https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/banner/public/spring_staffpicks_banner.png?itok=IICOHEVM',
      description: 'Alt for image 01',
      alt: 'Alt for image 01',
    },
    mobileBannerImage: {
      'full-uri': 'https://d2720ur5668dri.cloudfront.net/sites/default/files/styles/mobile_banner/public/spring_staffpicks_mobile.jpg?itok=chvIHr2Y',
      description: 'Alt for image 01',
      alt: 'Alt for image 01',
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
              "" :
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
