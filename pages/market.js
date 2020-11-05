import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SwipeableViews from 'react-swipeable-views';
import cx from 'classnames';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import filterAsync from 'node-filter-async';
import fetch from 'node-fetch';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { CollectionFill as AllIcon } from '@styled-icons/bootstrap/CollectionFill';
import { StarFill as StarIcon } from '@styled-icons/bootstrap/StarFill';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { Handshake as AproovedIcon } from '@styled-icons/fa-solid/Handshake';
import { Button, Box, AppBar, Tabs, Tab, TypeBox } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: '100vw',
    height: '100vh'
  },
  swipeableViews: {
    height: '100%',
    '& .react-swipeable-view-container': {
      height: '100%'
    }
  },
  fullHeight: {
    height: '100%'
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          display='flex'
          className={cx(
            classes.fullHeight,
            classes.padingTopCompensationForFooter
          )}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  };
}

function TicketGrid() {}

export default function Market() {
  const classes = useStyles();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [boards, setBoards] = useState([]);
  const [t, setT] = useState();
  const [cards, setCards] = useState([]);
  const db = firebase.firestore();

  async function getData(_t) {
    const snapshot = await db.collection('boards').get();
    const boardIdCollection = snapshot.docs.reduce((accumulator, doc) => {
      accumulator.push(doc.data().boardId);
      return accumulator;
    }, []);
    setBoards(boardIdCollection);
    getCards(boardIdCollection);
  }

  function getCards() {
    let _publishedCards = [];
    let count = 0;
    boards.forEach(async (board) => {
      ++count;
      const resp = await fetch(
        `https://api.trello.com/1/boards/${board}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
      );
      if (resp.status >= 400 && resp.status < 600) {
        throw new Error('Bad response from server');
      } else {
        const _cards = await resp.json();
        const _published = await filterAsync(_cards, async (_card, index) => {
          return (await t.get(_card.id, 'shared', 'published', false)) === true;
        });
        _publishedCards = _publishedCards.concat(_published);
      }
      if (count === boards.length) {
        setCards(_publishedCards);
        console.log(_publishedCards);
      }
    });
    // const snapshot = await db.collection('boards').get();
    // const boardIdCollection = snapshot.docs.reduce((accumulator, doc) => {
    //   accumulator.push(doc.data().boardId);
    //   return accumulator;
    // }, []);
    // setBoards(boardIdCollection);
    // console.log(boardIdCollection);
  }

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
  }, []);

  useEffect(() => {
    getData();
  }, [t]);

  function handleChangeTabOnSwipe(index) {
    setTab(index);
  }

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
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={handleChangeTabOnSwipe}
        className={cx(classes.swipeableViews, classes.fullHeight)}
      >
        <TabPanel
          value={tab}
          index={0}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          All
        </TabPanel>
        <TabPanel
          value={tab}
          index={1}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          Starred
        </TabPanel>
        <TabPanel
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          Claimed
        </TabPanel>
        <TabPanel
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          Approved
        </TabPanel>
      </SwipeableViews>
    </Box>
  );
}
