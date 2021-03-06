import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import axios from 'axios';
import axiosInstance from '../axios.config';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Box, Button } from '@material-ui/core';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#b361fe',
      lighter: ''
    },
    secondary: {
      main: '#85ff6e'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(1)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  }
}));

export default function ShowAuth() {
  const classes = useStyles();

  const oauthUrl = `https://trello.com/1/authorize?expiration=never&name=Out-Sorcerer&scope=read,write,account&key=${process.env.TRELLO_API_KEY}&callback_method=fragment&return_url=https://out-sorcerer.vercel.app/show-auth`;

  const tokenLooksValid = function (token) {
    return /^[0-9a-f]{64}$/.test(token);
  };

  const storageHandler = async function (evt, authorizeWindow) {
    authorizeWindow.close();
    let token = authorizeWindow.location.hash.split('=')[1];
    const t = window.TrelloPowerUp.iframe();
    await t.set('member', 'private', 'authToken', token);
    window.removeEventListener('storage', storageHandler);
    t.closePopup();
  };

  var authorizeOpts = {
    height: 680,
    width: 580,
    validToken: tokenLooksValid,
    windowCallback: function (authorizeWindow) {
      // This callback gets called with the handle to the
      // authorization window. This can be useful if you
      // can't call window.close() in your new window
      // (such as the case when your authorization page
      // is rendered inside an iframe).
      window.addEventListener('storage', function (e) {
        storageHandler(e, authorizeWindow);
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        className={classes.root}
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        style={{
          height: '100%'
        }}
      >
        <Button
          variant='contained'
          color='primary'
          onClick={() => {
            const t = window.TrelloPowerUp.iframe();
            t.authorize(oauthUrl, authorizeOpts);
            // .then(function (token) {
            //   console.log('new token: ', token);
            //   return t.set('member', 'private', 'authToken', token);
            // })
            // .then(function () {
            //   // now that the token is stored, we can close this popup
            //   // you might alternatively choose to open a new popup
            //   // t.closeModal();
            //   t.closePopup();
            // });
          }}
        >
          Authorize
        </Button>
      </Box>
    </ThemeProvider>
  );
}
