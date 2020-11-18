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
import axios from 'axios';
import { Cards } from '../components';
import _axios from '../axios.config';
import { getToken } from '../utils';

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
    setUser(_t.arg('userId'));
    getCards();
    getBoards();
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
    const _t = window.TrelloPowerUp.iframe();
    let token = _t.arg('token');
    console.log('token: ', token);
    let lists = await _axios.get(`/boards/${_t.arg('boardId')}/lists`, {
      params: { token }
    });
    lists = lists.data;
    console.log(lists);
    let found = lists.find((ls) => ls.name === 'OS Approved');
    if (!found) {
      console.log('OS Approved list not found - creating...');
      // OS Approved list isn't found so create it.
      found = await _axios.post(
        `/boards/${_t.arg('boardId')}/lists`,
        {
          name: 'OS Approved'
        },
        {
          params: {
            token
          }
        }
      );
    }
    console.log('OS Approved list created');
    console.log('Adding card to board');
    console.log(found);
    // Add card to board
    const newCard = await _axios.post(
      `/cards`,
      {
        idList: found.id,
        idCardSource: card.id,
        keepFromSource: 'all'
      },
      {
        params: {
          token
        }
      }
    );
    console.log('Card added', newCard.data);
    const webhooks = await _axios.get(`/tokens/${token}/webhooks`);
    console.log('active webhooks: ', webhooks);
    // delete previous webkooks
    const requests = card.data().webHooks.reduce((acc, wh) => {
      acc.push(() => _axios.delete(`/tokens/${token}/webhooks/${wh}`));
      return acc;
    }, []);
    const deleteResp = await axios.all(requests.map((request) => request()));
    console.log('deleteResp', deleteResp);
    // Create webhook for syncing to pusher card
    const publisherHook = await _axios.post(
      `/tokens/${token}/webhooks/`,
      {
        description: 'Sync Card',
        callbackURL: `https://us-central1-out-sorcerer.cloudfunctions.net/transaction`,
        idModel: card.id
      },
      {
        syncToCard: newCard.data.id,
        initiator: 'provider',
        userToken: token
      }
    );
    // Create webhook for syncing to publisher card
    const pusherHook = await _axios.post(
      `/tokens/${token}/webhooks/`,
      {
        description: 'Sync Card',
        callbackURL: `https://us-central1-out-sorcerer.cloudfunctions.net/transaction`,
        idModel: newCard.data.id
      },
      {
        syncToCard: card.id,
        initiator: 'pusher',
        userToken: token
      }
    );
    // Set fireCard "commited" field to true.
    console.log('publisherHook.id', publisherHook.data);
    console.log('pusherHook.id', pusherHook.data);
    await db
      .collection('cards')
      .doc(card.id)
      .set(
        {
          commited: true,
          webHooks: [publisherHook.data.id, pusherHook.data.id]
        },
        { merge: true }
      );
  }

  const unclaimedCards = useCallback((_cards, _user) => {
    if (!_user) return [];
    return _cards.filter((card) => !card.data().claims.includes(_user));
  }, []);

  const claimedCards = useCallback((_cards, _user) => {
    if (!_user) return [];
    return _cards.filter((card) => card.data().claims.includes(_user));
  }, []);

  const approvedCards = useCallback((_cards, _user) => {
    if (!_user) return [];
    return _cards.filter((card) => card.data().contractedTo === _user);
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
                badgeContent={unclaimedCards(cards, user).length}
                color='secondary'
              >
                <AllIcon size={25} />
              </StyledBadge>
            }
            label='Market'
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
                badgeContent={claimedCards(cards, user).length}
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
                badgeContent={approvedCards(cards, user).length}
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
          cards={unclaimedCards(cards, user)}
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
          cards={claimedCards(cards, user)}
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
          cards={approvedCards(cards, user)}
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
