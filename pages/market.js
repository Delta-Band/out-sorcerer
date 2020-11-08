import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import cx from 'classnames';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { format } from 'timeago.js';
import StackGrid from 'react-stack-grid';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { CollectionFill as AllIcon } from '@styled-icons/bootstrap/CollectionFill';
import { StarFill as StarIcon } from '@styled-icons/bootstrap/StarFill';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { Handshake as AproovedIcon } from '@styled-icons/fa-solid/Handshake';
import { MoreVertical as KebabIcon } from '@styled-icons/evaicons-solid/MoreVertical';
import {
  Box,
  AppBar,
  Tabs,
  Tab,
  Card,
  CardHeader,
  Avatar,
  IconButton
} from '@material-ui/core';

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
                (board) => board.data().boardId === card.boardId
              );
              console.log('card', card);
              // const color = fac.getColorAsync(coverImg);
              const data = card.data();
              const coverImg = data.native.cover.scale
                ? data.native.cover.scale[0].url
                : null;
              return (
                <div key={card.id}>
                  <Card className={classes.card}>
                    <CardHeader
                      avatar={
                        <Avatar aria-label='recipe'>
                          <img
                            src={board.data().boardslogo}
                            className={classes.avatar}
                          />
                        </Avatar>
                      }
                      action={
                        <IconButton aria-label='settings'>
                          <KebabIcon />
                        </IconButton>
                      }
                      title={board.id}
                      subheader={format(data.publishDate)}
                    />
                    {coverImg && (
                      <img
                        className={classes.media}
                        src={coverImg}
                        // title={card.name}
                      />
                    )}
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
  const [cards, setCards] = useState([]);
  const db = firebase.firestore();

  async function getCards(_boards) {
    const querySnapshot = await db
      .collection('cards')
      .where('published', '!=', null)
      .get();
    setCards(querySnapshot.docs);
    // setCards(cardsMock);
    // const snapshot = await db.collection('boards').get();
    // const boardIdCollection = snapshot.docs.reduce((accumulator, doc) => {
    //   accumulator.push(doc.data().boardId);
    //   return accumulator;
    // }, []);
    // setBoards(boardIdCollection);
    // console.log(boardIdCollection);
  }

  async function getBoards() {
    const snapshot = await db.collection('boards').get();
    setBoards(snapshot.docs);
  }

  useEffect(() => {
    // const _t = window.TrelloPowerUp.iframe();
    // setT(_t);
    getCards();
    getBoards();
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
      <Box className={cx(classes.swipeableViews, classes.fullHeight)}>
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
      </Box>
    </Box>
  );
}
