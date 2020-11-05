import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import SwipeableViews from 'react-swipeable-views';
import cx from 'classnames';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import filterAsync from 'node-filter-async';
import TimeAgo from 'react-timeago';
import FastAverageColor from 'fast-average-color';
import fetch from 'node-fetch';
import StackGrid from 'react-stack-grid';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { CollectionFill as AllIcon } from '@styled-icons/bootstrap/CollectionFill';
import { StarFill as StarIcon } from '@styled-icons/bootstrap/StarFill';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { Handshake as AproovedIcon } from '@styled-icons/fa-solid/Handshake';
import { MoreVertical as KebabIcon } from '@styled-icons/evaicons-solid/MoreVertical';
import cardsMock from '../mocks/cards.mock';
import {
  Button,
  Box,
  AppBar,
  Tabs,
  Tab,
  TypeBox,
  Paper,
  Grid,
  Card,
  CardHeader,
  CardMedia,
  CardActions,
  Avatar,
  IconButton,
  Typography
} from '@material-ui/core';

const fac = new FastAverageColor();

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: '#333',
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
  },
  card: {
    '& .MuiCardHeader-title': {
      textTransform: 'capitalize'
    }
    // '& .MuiCardMedia-root': {
    //   backgroundSize: 'contain'
    // }
  },
  avatar: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  media: {
    width: '100%'
  },
  grid: {
    width: '100%'
  }
}));

function TabPanel(props) {
  const { cards, boards, value, index, ...other } = props;
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
          <StackGrid columnWidth={'25%'} className={classes.grid}>
            {cards.map((card) => {
              const board = boards.find(
                (board) => board.boardId === card.idBoard
              );
              const coverImg = card.cover.scaled.slice(-1)[0].url;
              // const color = fac.getColorAsync(coverImg);
              return (
                <div key={card.id}>
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label='recipe'>
                          <img src={board.logo} className={classes.avatar} />
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label='settings'>
                          <KebabIcon />
                        </IconButton>
                      }
                      title={board.name}
                      subheader={<TimeAgo date={card.publishDate} />}
                    />
                    <img
                      className={classes.media}
                      src={coverImg}
                      // title={card.name}
                    />
                  </Card>
                </div>
              );
            })}
          </StackGrid>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

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
  const [t, setT] = useState();
  const [cards, setCards] = useState([]);
  const db = firebase.firestore();

  async function getData(_t) {
    const snapshot = await db.collection('boards').get();
    const _boards = snapshot.docs.reduce((accumulator, doc) => {
      accumulator.push({ ...doc.data(), ...{ name: doc.id } });
      return accumulator;
    }, []);
    setBoards(_boards);
    getCards(_boards);
  }

  function getCards(_boards) {
    let _publishedCards = [];
    let count = 0;
    _boards.forEach(async (board) => {
      console.log('getting cards for board: ', board.boardId);
      ++count;
      const resp = await fetch(
        `https://api.trello.com/1/boards/${board.boardId}/cards?key=${process.env.TRELLO_API_KEY}&token=${process.env.TRELLO_API_TOKEN}`
      );
      if (resp.status >= 400 && resp.status < 600) {
        throw new Error('Bad response from server');
      } else {
        const _cards = await resp.json();
        console.log('cards', _cards);
        const _published = await filterAsync(_cards, async (_card, index) => {
          const published = await t.get(_card.id, 'shared', 'published', false);
          if (published) {
            _cards[index].publishDate = await t.get(
              _card.id,
              'shared',
              'publishDate',
              null
            );
          }
          return published;
        });
        _publishedCards = _publishedCards.concat(_published);
      }
      console.log(`count is: ${count}, baords length is: ${_boards.length}`);
      if (count === _boards.length) {
        setCards(_publishedCards);
        console.log(_publishedCards);
      }
    });
    setCards(cardsMock);
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
    if (t) {
      getData();
    }
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
          cards={cards}
          boards={boards}
        />
        <TabPanel
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
        />
      </SwipeableViews>
    </Box>
  );
}
