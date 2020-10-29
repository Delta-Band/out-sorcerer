import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Head from 'next/head';
import PropTypes from 'prop-types';

const Helmet = ({ title, description, imageForSocial }) => (
  <Head>
    <meta charSet="utf-8" />
    <link rel="icon" href={`/images/favicon.ico?v=${new Date().getTime()}`} />
    <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
    <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript"></script>
    <title>{title}</title>
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageForSocial} />
    <meta property="og:url" content="https://delta.band" />
    <meta name="description" content={description} />
    <meta
      name="google-site-verification"
      content="lqnq_1HVklw95GPM5jTBEa1kxzNewPQCOLjgiwrPXDI"
    />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    />
    <meta httpEquiv="ScreenOrientation" content="autoRotate:disabled" />
  </Head>
);

Helmet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string
};

Helmet.defaultProps = {
  title: 'Mt Title',
  description: 'My Description'
};

const mapStateToProps = state => ({}); // eslint-disable-line

const mapDispatchToProps = dispatch => ({}); // eslint-disable-line

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
)(Helmet);
