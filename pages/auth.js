import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import axios from 'axios';
import axiosInstance from '../axios.config';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

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

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
  }, []);

  // const getWebPage = useCallback(async (claimerId) => {
  //   const webPage = await db.collection('puhsers').doc(claimerId).get().data();
  //   return webPage;
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>Auth page</Box>
    </ThemeProvider>
  );
}
