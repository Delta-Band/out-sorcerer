import React from 'react';
// import { useScript } from '../hooks';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { AnimatePresence } from 'framer-motion';
import { Provider } from 'react-redux';
import { store } from '../store/store';
import firebase from 'firebase';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
// import { FB_API_KEY } from '../secrets';
import '../styles/globals.css';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'out-sorcerer.firebaseapp.com',
  databaseURL: 'https://out-sorcerer.firebaseio.com',
  projectId: 'out-sorcerer',
  storageBucket: 'out-sorcerer.appspot.com',
  messagingSenderId: '88596021654',
  appId: '1:88596021654:web:4c2cd29a0c32fd3fe85db7',
  measurementId: 'G-394JKWTMK8'
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

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
      main: '#fcba03'
    },
    text: {
      dark: '#242424'
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
