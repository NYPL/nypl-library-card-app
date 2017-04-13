import React from 'react';
import { Header, navConfig } from '@nypl/dgx-header-component';
import Footer from '@nypl/dgx-react-footer';
import ContentBanner from 'dgx-homepage-content-banner';
import LibraryCardForm from '../../containers/LibraryCardForm/LibraryCardForm';

const dummyBannerContent = {
  title: {
    type: 'text-group',
    en: {
      text: 'title01',
    },
  },
  category: {
    type: 'text-group',
    en: {
      text: 'category01',
    },
  },
  description: {
    type: 'text-group',
    en: {
      text: 'description01',
    },
  },
  image: {
    bannerImage: {
      'full-uri': 'https://petrol.nypl.org/sites/default/files/desktop.carousel.ez-3.jpg',
      description: 'Alt for image 01',
      alt: 'Alt for image 01',
    },
    mobileBannerImage: {
      'full-uri': ' https://petrol.nypl.org/sites/default/files/booklist_mobile.jpg',
      description: 'Alt for image 01',
      alt: 'Alt for image 01',
    },
  },
};

const ApplicationContainer = () => (
  <div className="nypl-library-card-app">
    <Header
      skipNav={{ target: 'main-content' }}
      navData={navConfig.current}
    />
    <section id="main-content">
      <ContentBanner
        className="nypl-library-card-banner"
        items={[dummyBannerContent]}
      />
      <LibraryCardForm />
    </section>
    <Footer />
  </div>
);

export default ApplicationContainer;
