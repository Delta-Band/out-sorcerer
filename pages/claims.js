import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import {
  Box,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  Button
} from '@material-ui/core';

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
  const [claimers, setClaimers] = useState([]);
  // const [cardData, setCardData] = useState({
  //   contractedTo: null
  // });
  const classes = useStyles();

  async function getClaimers(claims) {
    const requests = claims.reduce((acc, uid) => {
      acc.push(() => _axios.get(`members/${uid}`));
      return acc;
    }, []);
    const results = await axios.all(requests.map((request) => request()));
    console.log('results: ', results);
    setClaimers(
      results.reduce((acc, itm) => {
        acc.push(itm.data);
        return acc;
      }, [])
    );
  }

  // async function approveClaimer(claimerId) {
  //   const _t = window.TrelloPowerUp.iframe();
  //   await _t.arg('fireCardRef').set(
  //     {
  //       contractedTo: claimerId
  //     },
  //     { merge: true }
  //   );
  //   _t.set('card', 'shared', 'lastUpdate', Date.now());
  // }

  // async function revokeClaimer(claimerId) {
  //   const _t = window.TrelloPowerUp.iframe();
  //   await _t.arg('fireCardRef').set(
  //     {
  //       contractedTo: null
  //     },
  //     { merge: true }
  //   );
  //   _t.set('card', 'shared', 'lastUpdate', Date.now());
  // }

  useEffect(() => {
    // const _t = window.TrelloPowerUp.iframe();
    // setCardData(_t.arg('fireCardData'));
    // getClaimers(_t.arg('fireCardData').claims);
  }, []);

  // const getWebPage = useCallback(async (claimerId) => {
  //   const webPage = await db.collection('puhsers').doc(claimerId).get().data();
  //   return webPage;
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        Hello
        {/* <List dense>
          {claimers.map((claimer) => (
            <ListItem key={claimer.id}>
              <ListItemAvatar>
                <Avatar src={claimer.avatarUrl} alt={claimer.fullName} />
              </ListItemAvatar>
              <ListItemText
                primary={claimer.fullName}
                secondary={
                  <Box>
                    <a>Linkedin</a>
                    <a href={`mailto:${claimer.email}`}>Email</a>
                  </Box>
                }
              />
              <ListItemSecondaryAction>
                <Button
                  edge='end'
                  aria-label='delete'
                  disabled={
                    cardData.contractedTo &&
                    cardData.contractedTo !== claimer.id
                  }
                  onClick={() => {
                    if (cardData.contractedTo === claimer.id) {
                      revokeClaimer(claimer.id);
                    } else {
                      approveClaimer(claimer.id);
                    }
                  }}
                >
                  {cardData.contractedTo && cardData.contractedTo === claimer.id
                    ? 'Revoke'
                    : 'Aproove'}
                </Button>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List> */}
      </Box>
    </ThemeProvider>
  );
}
