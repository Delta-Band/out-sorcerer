import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
// import { LinkedinWithCircle as LinkedinIcon } from '@styled-icons/entypo-social/LinkedinWithCircle';
// import { Email as EmailIcon } from '@styled-icons/material/Email';
import axios from 'axios';
import axiosInstance from '../axios.config';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Box, Avatar, Button, Card, CardHeader } from '@material-ui/core';

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
  const [contractedTo, setContractedTo] = useState([]);
  const classes = useStyles();

  async function getClaimers(claims) {
    const requests = claims.reduce((acc, uid) => {
      acc.push(() => axiosInstance.get(`members/${uid}`));
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

  async function approveClaimer(claimerId) {
    const _t = window.TrelloPowerUp.iframe();
    await db.collection('cards').doc(_t.arg('cardId')).set(
      {
        contractedTo: claimerId
      },
      { merge: true }
    );
    _t.set('card', 'shared', 'lastUpdate', Date.now());
  }

  async function revokeClaimer(claimerId) {
    const _t = window.TrelloPowerUp.iframe();
    await db.collection('cards').doc(_t.arg('cardId')).set(
      {
        contractedTo: null
      },
      { merge: true }
    );
    _t.set('card', 'shared', 'lastUpdate', Date.now());
  }

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    db.collection('cards')
      .doc(_t.arg('cardId'))
      .onSnapshot((snapshot) => {
        console.log(snapshot.data());
        setContractedTo(snapshot.data().contractedTo);
        getClaimers(snapshot.data().claims);
      });
  }, []);

  // const getWebPage = useCallback(async (claimerId) => {
  //   const webPage = await db.collection('puhsers').doc(claimerId).get().data();
  //   return webPage;
  // }, []);

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        {claimers.map((claimer) => (
          <Card
            key={claimer.id}
            style={{
              marginBottom: theme.spacing(1)
            }}
          >
            <CardHeader
              avatar={
                <Avatar
                  src={`${claimer.avatarUrl}/60.png`}
                  alt={claimer.fullName}
                />
              }
              action={
                <Button
                  edge='end'
                  aria-label='delete'
                  variant='contained'
                  size='small'
                  color='primary'
                  style={{
                    transform: 'translate(-6px, 12px)',
                    width: 85,
                    paddingTop: 7,
                    height: 30
                  }}
                  disabled={contractedTo && contractedTo !== claimer.id}
                  onClick={() => {
                    if (contractedTo === claimer.id) {
                      revokeClaimer(claimer.id);
                    } else {
                      approveClaimer(claimer.id);
                    }
                  }}
                >
                  {contractedTo && contractedTo === claimer.id
                    ? 'Revoke'
                    : 'Aproove'}
                </Button>
              }
              title={claimer.fullName}
              subheader={
                <Box displa='flex' justifyContent='center'>
                  <a>Linkedin</a>
                </Box>
              }
            />
          </Card>
        ))}
      </Box>
    </ThemeProvider>
  );
}
