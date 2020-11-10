import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

const _axios = axios.create({
  baseURL: 'https://api.trello.com/1/',
  timeout: 1000,
  params: {
    key: process.env.TRELLO_API_KEY,
    token: process.env.TRELLO_API_TOKEN
  }
});

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

export default function Claims() {
  const db = firebase.firestore();
  const [claimers, setClaimers] = useState([]);
  const classes = useStyles();

  async function getClaimers(claims) {
    const requests = claims.reduce((acc, uid) => {
      acc.push(() => _axios.get(`members/${uid}`));
      return acc;
    }, []);
    const results = await _axios.all(requests);
    console.log('results: ', results);
    setClaimers(results);
  }

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    getClaimers(_t.arg('claims'));
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>Claimers</Box>
    </ThemeProvider>
  );
}
