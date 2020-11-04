import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheets } from '@material-ui/core/styles';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang='en-US'>
        <Head>
          <title>Out-Sorcerer</title>
          <meta charSet='utf-8' />
          <link
            rel='icon'
            href={`/images/favicon.ico?v=${new Date().getTime()}`}
          />
          <script src='https://p.trellocdn.com/power-up.min.js'></script>
          {/* <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={imageForSocial} />
    <meta property="og:url" content="https://delta.band" />
    <meta name="description" content={description} />
    <meta
      name="google-site-verification"
      content="lqnq_1HVklw95GPM5jTBEa1kxzNewPQCOLjgiwrPXDI"
    /> */}
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'
          />
          <meta httpEquiv='ScreenOrientation' content='autoRotate:disabled' />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

MyDocument.getInitialProps = async (ctx) => {
  // Render app and page and get the context of the page with collected side effects.
  const sheets = new ServerStyleSheets();
  const originalRenderPage = ctx.renderPage;

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => (props) => sheets.collect(<App {...props} />)
    });

  const initialProps = await Document.getInitialProps(ctx);

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [
      ...React.Children.toArray(initialProps.styles),
      sheets.getStyleElement()
    ]
  };
};

export default MyDocument;
