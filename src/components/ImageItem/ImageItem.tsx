import React from 'react';

interface ImageItemProps {
  handleOnLoad: (e?) => {};
  images: any;
  viewportWidth: number;
  viewportBreakpoint: number;
  handleOnError?: () => {};
};

interface ImageItemState {
  loaded: boolean;
}

class ImageItem extends React.Component<ImageItemProps, ImageItemState> {
  static defaultProps = {
    viewportBreakpoint: 769,
  }

  constructor(props) {
    super(props);
    this.handleOnLoad = this.handleOnLoad.bind(this);
    this.handleOnError = this.handleOnError.bind(this);

    this.state = {
      loaded: false,
    };
  }

  componentWillUpdate() {
    if (this.state.loaded === false) {
      this.handleOnLoad();
    }
  }

  /**
   * @desc this is the function to assign image alt to a new object with its
   * fallbacks.
   * @param {object} obj has the contents of banner image and rectangular image.
   * @return {object} it returns an object comtains image alt, or its fallback.
   */
  getImageSrcByViewport(obj, viewportWidth, breakpoint) {
    if (!obj) {
      return '';
    }

    if (viewportWidth > breakpoint) {
      return this.getImage(obj, 'large');
    }
    return this.getImage(obj, 'small');
  }

  /**
   * @desc This function assigns the proper banner image source or defaults to an empty string.
   * @param {object} obj has the contents of image object with uri.
   * @param {string} type of image as string (small, large)
   * @return {string} it returns a string representation of image source or its fallback.
   */
  getImage(obj: any, type) {
    if (type === 'small') {
      return (obj && obj.mobileBannerImage && obj.mobileBannerImage['full-uri']) ?
        obj.mobileBannerImage['full-uri'] : '';
    }
    if (type === 'large') {
      return (obj && obj.bannerImage && obj.bannerImage['full-uri']) ?
        obj.bannerImage['full-uri'] : '';
    }
    return '';
  }

  /**
   * @desc This function assigns the proper ALT text with a fallback.
   * @param {object} obj has the contents of image object with description.
   * @return {string} it returns a string representation or its fallback.
   */
  getImageAlt(obj: any) {
    let alt;

    try {
      const {
        bannerImage: {
          alt: desc,
        },
      } = obj;

      alt = desc;
    } catch (e) {
      alt = 'We are sorry. This image is not available.';
    }

    return alt;
  }

  /**
   * @desc This function is called on every image load, assigns loaded class when fired.
   * @param {object} Prototype.event global for onLoad method
   */
  handleOnLoad(event?) {
    this.setState({ loaded: true });
    if (this.props.handleOnLoad) {
      this.props.handleOnLoad(event);
    }
  }

  /**
   * @desc This function is called on an error image load. Fires an optional handle function.
   */
  handleOnError() {
    if (this.props.handleOnError) {
      this.props.handleOnError();
    }
  }

  render() {
    const {
      images,
      viewportWidth,
      viewportBreakpoint,
    } = this.props;

    const alt = this.getImageAlt(images);
    const imgSrc = this.getImageSrcByViewport(images, viewportWidth, viewportBreakpoint);
    const loadedClass = this.state.loaded ? 'loaded' : 'notLoaded';

    return (
      <img
        ref="image"
        className={loadedClass}
        src={imgSrc}
        alt={alt}
        onLoad={this.handleOnLoad}
        onError={this.handleOnError}
        tabIndex={0}
      />
    );
  }
}

export default ImageItem;
