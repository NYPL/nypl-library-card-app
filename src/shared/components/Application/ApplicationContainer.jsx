import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import LibraryCardForm from '../../containers/LibraryCardForm/LibraryCardForm';
// ContentBanner is inside the app instead of importing from dgx-homepage-content-banner
// for h1 title tag accessibility compliance.
// import ContentBanner from 'dgx-homepage-content-banner';
import ContentBanner from '../../components/ContentBanner/ContentBanner';

const bannerContent = {
  title: {
    type: 'text-group',
    en: {
      text: 'GET A LIBRARY CARD',
    },
  },
  description: {
    type: 'text-group',
    en: {
      text: 'Any person who lives, works, attends school or pays property taxes in New York State is eligible to receive a New York Public Library card free of charge. With a library card you get free access to resources and services across all New York Public Library locations. You can borrow library materials, reserve a computer, download digital media, and search hundreds on online magazines and databases.',
    },
  },
  image: {
    bannerImage: {
      'full-uri': 'https://d140u095r09w96.cloudfront.net/sites/default/files/get-a-library-card-banner.png',
      description: 'books centered on a bookshelf',
      alt: '',
    },
    mobileBannerImage: {
      'full-uri': 'https://d140u095r09w96.cloudfront.net/sites/default/files/get-a-library-card-banner.png',
      description: 'books centered on a bookshelf',
      alt: '',
    },
  },
};

const ApplicationContainer = () => (
  <div className="nypl-library-card-app">
    <Header
      skipNav={{ target: 'main-content' }}
      navData={navConfig.current}
    />
    <main id="main-content">
      <ContentBanner
        className="nypl-library-card-banner"
        items={[bannerContent]}
      />
      <LibraryCardForm />
    </main>
    <Footer />
  </div>
);

export default ApplicationContainer;
