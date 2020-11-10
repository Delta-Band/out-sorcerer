import React, { useEffect, useState } from 'react';
// import cx from 'classnames';
import firebase from 'firebase';
import uniq from 'lodash/uniq';
import { format } from 'timeago.js';
import ReactMarkdown from 'react-markdown';
// import Linkify from 'react-linkify';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Dollar as RewardIcon } from '@styled-icons/boxicons-regular/Dollar';
import { BusinessTime as TimeboxIcon } from '@styled-icons/fa-solid/BusinessTime';
// import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  Button,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100vw',
    boxSizing: 'border-box',
    height: '100vh',
    '& a': {
      color: theme.palette.secondary.light,
      textDecoration: 'underline',
      outline: '0 !important'
    },
    '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
      marginTop: 0
    },
    '& .react-photo-gallery--gallery img': {
      objectFit: 'cover'
    }
  },
  avatar: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  media: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    transform: `translateX(${theme.spacing(1)}px)`,
    borderRadius: 10,
    overflow: 'hidden'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  label: {
    marginRight: theme.spacing(3)
  }
}));

const cardWidth = 600;

function Label(props) {
  const { txt, icon, color } = props;
  const classes = useStyles();

  return (
    <Box
      display='flex'
      alignItems='center'
      className={classes.label}
      borderRadius={25}
      style={{
        color: color
      }}
    >
      {icon}
      {/* <Box width={theme.spacing(0.5)}></Box> */}
      <Box>
        <Typography variant='caption'>{txt}</Typography>
      </Box>
    </Box>
  );
}

function SectionHeader(props) {
  const { txt } = props;
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Box
      px={2}
      mx={2}
      py={1}
      borderRadius='borderRadius'
      style={{
        textAlign: 'center',
        padding: theme.spacing(1),
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
      }}
    >
      <Typography className={classes.capitalize}>{txt}</Typography>
    </Box>
  );
}

function CardDetails(props) {
  const { card, boards, closeLightbox, user } = props;
  const db = firebase.firestore();
  const classes = useStyles();
  const theme = useTheme();
  const [claimed, setClaimed] = useState(false);

  const board = boards.find((board) => board.id === card.data().boardId);

  const galleryImages = card.data().native.attachments.reduce((acc, itm) => {
    acc.push(itm.url);
    return acc;
  }, []);

  async function toggleClaim() {
    let claims = card.data().claims;
    if (claimed) {
      claims = claims.filter((c) => c !== user);
    } else {
      claims = uniq(card.data().claims.concat([user]));
    }
    db.collection('cards').doc(card.id).set({ claims }, { merge: true });
  }

  useEffect(() => {
    const claimed = user && card.data().claims.includes(user);
    setClaimed(claimed);
  }, [card.data().claims.length]);

  return (
    <Box
      className={classes.root}
      display='flex'
      justifyContent='center'
      p={3}
      onClick={closeLightbox}
    >
      <Card
        onClick={(e) => {
          e.stopPropagation();
        }}
        style={{
          height: '100%',
          width: cardWidth,
          borderRadius: 0,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          borderBottom={1}
          boxShadow={4}
          zIndex={1}
          style={{
            borderColor: theme.palette.secondary.dark
          }}
        >
          <CardHeader
            avatar={
              <Avatar aria-label='recipe'>
                <img src={board.data().logo} className={classes.avatar} />
              </Avatar>
            }
            action={
              <Button
                size='meduim'
                variant={claimed ? 'outlined' : 'contained'}
                color='primary'
                style={{
                  transform: 'translate(-6px, 12px)',
                  width: 130,
                  height: 36
                }}
                onClick={() => {
                  toggleClaim();
                }}
              >
                {claimed ? 'claimed' : 'claim'}
              </Button>
            }
            title={board.id}
            subheader={
              <Box display='flex' alignItems='center' style={{ marginTop: 4 }}>
                {/* <PublishedIcon
                            size={18}
                            style={{ transform: 'translateY(-1px)' }}
                          />
                          <Box width={10} /> */}
                <div>{format(card.data().published)}</div>
              </Box>
            }
          />
        </Box>
        <Box
          py={2}
          style={{
            overflow: 'hidden',
            overflowY: 'auto',
            height: '100%'
          }}
        >
          <SectionHeader txt={card.data().native.name} />
          <Box px={2} py={1} display='flex'>
            <Label
              txt={card.data().reward}
              icon={<RewardIcon size={18} />}
              color={theme.palette.secondary.main}
            />
            <Label
              txt={
                <span style={{ paddingLeft: 4 }}>{card.data().timebox}</span>
              }
              icon={<TimeboxIcon size={20} />}
              color={theme.palette.secondary.dark}
            />
          </Box>
          <Box p={2}>
            <ReactMarkdown>{card.data().native.desc}</ReactMarkdown>
            {!card.data().native.desc && (
              <Typography>There is no description for this card.</Typography>
            )}
          </Box>
          <SectionHeader txt='Attachments' />
          <Box px={2} py={1}>
            {galleryImages.map((imgSrc) => (
              <img
                key={imgSrc}
                src={imgSrc}
                style={{
                  marginBottom: theme.spacing(1),
                  width: '100%'
                }}
              />
            ))}
            {galleryImages.length === 0 && (
              <Typography>There are no attachments on this card.</Typography>
            )}
          </Box>
        </Box>
      </Card>
    </Box>
  );
}

export default CardDetails;
