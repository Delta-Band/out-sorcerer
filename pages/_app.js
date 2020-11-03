import React from 'react';
import { useScript } from '../hooks';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import '../styles/globals.css';

const defaultTheme = createMuiTheme();

const theme = createMuiTheme({
  frameWrapper: {
    width: 280,
    boxSizing: 'border-box',
    padding: defaultTheme.spacing(1)
  },
  palette: {
    type: 'dark',
    primary: {
      main: '#b361fe',
      lighter: ''
    },
    secondary: {
      main: '#85ff6e'
    }
  }
});

function MyApp({ Component, pageProps, router }) {
  useScript('https://p.trellocdn.com/power-up.min.js');

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
