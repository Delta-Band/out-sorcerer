import React, { useState, useEffect, useCallback } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import firebase from 'firebase';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { CollectionFill as AllIcon } from '@styled-icons/bootstrap/CollectionFill';
import { StarFill as StarIcon } from '@styled-icons/bootstrap/StarFill';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { Handshake as AproovedIcon } from '@styled-icons/fa-solid/Handshake';
import { Box, AppBar, Tabs, Tab, Badge } from '@material-ui/core';
import uniq from 'lodash/uniq';
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

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -5,
    transform: 'translate(100%, -8px)',
    top: 13,
    border: `2px solid ${theme.palette.grey[900]}`,
    padding: '0 4px'
  }
}))(Badge);

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

  async function claim(card) {
    let claims = card.data().claims;
    claims = uniq(card.data().claims.concat([user]));
    db.collection('cards').doc(card.id).set({ claims }, { merge: true });
  }

  async function unclaim(card) {
    let claims = card.data().claims;
    claims = claims.filter((c) => c !== user);
    db.collection('cards').doc(card.id).set({ claims }, { merge: true });
  }

  async function addToBoard(card) {
    console.log('adding card to board: ', card);
    // let claims = card.data().claims;
    // claims = claims.filter((c) => c !== user);
    // db.collection('cards').doc(card.id).set({ claims }, { merge: true });
  }

  const unclaimedCards = useCallback((_cards) => {
    return _cards.filter((card) => user && !card.data().claims.includes(user));
  }, []);

  const claimedCards = useCallback((_cards) => {
    return _cards.filter((card) => user && card.data().claims.includes(user));
  }, []);

  const approvedCards = useCallback((_cards) => {
    return _cards.filter((card) => user && card.data().contractedTo === user);
  }, []);

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
          <Tab
            icon={
              <StyledBadge
                badgeContent={unclaimedCards(cards).length}
                color='secondary'
              >
                <AllIcon size={25} />
              </StyledBadge>
            }
            label='All'
            {...a11yProps(0)}
          />
          <Tab
            icon={
              <StyledBadge badgeContent={0} color='secondary'>
                <StarIcon size={25} />
              </StyledBadge>
            }
            label='Starred'
            {...a11yProps(1)}
          />
          <Tab
            icon={
              <StyledBadge
                badgeContent={claimedCards(cards).length}
                color='secondary'
              >
                <ClaimedIcon
                  size={28}
                  style={{ marginBottom: '0px', transform: 'translateY(-3px)' }}
                />
              </StyledBadge>
            }
            label='Claimed'
            {...a11yProps(2)}
          />
          <Tab
            icon={
              <StyledBadge
                badgeContent={approvedCards(cards).length}
                color='secondary'
              >
                <AproovedIcon
                  size={32}
                  style={{
                    marginBottom: '-2px',
                    transform: 'translateY(-2px)'
                  }}
                />
              </StyledBadge>
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
          cards={unclaimedCards(cards)}
          boards={boards}
          user={user}
          action={{
            cb: claim,
            text: 'Claim'
          }}
        />
        <Cards
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={claimedCards(cards)}
          boards={boards}
          user={user}
          action={{
            cb: unclaim,
            text: 'Unclaim'
          }}
        />
        <Cards
          value={tab}
          index={3}
          dir={theme.direction}
          className={classes.fullHeight}
          cards={approvedCards(cards)}
          boards={boards}
          user={user}
          action={{
            cb: addToBoard,
            text: 'Add to board'
          }}
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
