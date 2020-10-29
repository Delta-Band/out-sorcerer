import React from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../styles/globals.css';
import '../client';

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#5668FF'
    },
    secondary: {
      main: '#ffffff'
    }
  }
});

function MyApp({ Component, pageProps, router }) {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <div>
          <AnimatePresence>
            <Component {...pageProps} key={router.route} />
          </AnimatePresence>
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;
