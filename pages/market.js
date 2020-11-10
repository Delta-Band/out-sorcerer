import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import fetch from 'node-fetch';
import firebase from 'firebase';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { CollectionFill as AllIcon } from '@styled-icons/bootstrap/CollectionFill';
import { StarFill as StarIcon } from '@styled-icons/bootstrap/StarFill';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { Handshake as AproovedIcon } from '@styled-icons/fa-solid/Handshake';
import { Box, AppBar, Tabs, Tab } from '@material-ui/core';
import { Cards } from '../components';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#333',
    color: theme.palette.text.primary,
    width: '100%',
    height: '100vh',
    overflow: 'hidden'
  },
  swipeableViews: {
    height: 'calc(100vh - 71px)',
    overflow: 'hidden',
    overflowY: 'auto'
  },
  fullHeight: {
    height: '100%'
  }
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

export default function Market() {
  const classes = useStyles();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [boards, setBoards] = useState([]);
  const [cards, setCards] = useState([]);
  const [user, setUser] = useState();
  const db = firebase.firestore();

  async function getCards(_boards) {
    await db
      .collection('cards')
      .where('published', '!=', null)
      .onSnapshot(function (querySnapshot) {
        setCards(querySnapshot.docs);
      });
  }

  async function getBoards() {
    const querySnapshot = await db.collection('boards').get();
    setBoards(querySnapshot.docs);
  }

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    getCards();
    getBoards();
    setUser(_t.arg('userId'));
  }, []);

  function handleChangeTab(event, newValue) {
    setTab(newValue);
  }

  return (
    <Box className={classes.root} display='flex' flexDirection='column'>
      <Head>
        <title>OS Market</title>
      </Head>
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
        >
          <Tab icon={<AllIcon size={25} />} label='All' {...a11yProps(0)} />
          <Tab
            icon={<StarIcon size={25} />}
            label='Starred'
            {...a11yProps(1)}
          />
          <Tab
            icon={
              <ClaimedIcon
                size={28}
                style={{ marginBottom: '0px', transform: 'translateY(-3px)' }}
              />
            }
            label='Claimed'
            {...a11yProps(2)}
          />
          <Tab
            icon={
              <AproovedIcon
                size={32}
                style={{ marginBottom: '-2px', transform: 'translateY(-2px)' }}
              />
            }
            label='Approved'
            {...a11yProps(3)}
          />
        </Tabs>
      </AppBar>
      <Box
        className={cx(classes.swipeableViews, classes.fullHeight)}
        display='flex'
      >
        <Cards
          value={tab}
          index={0}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={cards}
          boards={boards}
          user={user}
        />
        <Cards
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={cards.filter(
            (card) => user && card.data().claims.includes(user)
          )}
          boards={boards}
          user={user}
        />
        {/* <TabPanel
          value={tab}
          index={1}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={cards}
          boards={boards}
        />
        <TabPanel
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={cards}
          boards={boards}
        />
        <TabPanel
          value={tab}
          index={3}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={cards}
          boards={boards}
        /> */}
      </Box>
    </Box>
  );
}
