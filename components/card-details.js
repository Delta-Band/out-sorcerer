import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { format } from 'timeago.js';
import ReactMarkdown from 'react-markdown';
import Linkify from 'react-linkify';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Dollar as RewardIcon } from '@styled-icons/boxicons-regular/Dollar';
import { BusinessTime as TimeboxIcon } from '@styled-icons/fa-solid/BusinessTime';
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  IconButton,
  Button,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 600,
    boxSizing: 'border-box',
    height: 'calc(100vh - 71px)',
    '& a': {
      color: theme.palette.secondary.light,
      textDecoration: 'underline'
    },
    '& p, & h1, & h2, & h3, & h4, & h5, & h6': {
      marginTop: 0
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

function CardDetails(props) {
  const { card, boards } = props;
  const classes = useStyles();
  const theme = useTheme();
  const board = boards.find(
    (board) => board.data().boardId === card.data().boardId
  );
  const coverImg = card.data().native.cover.scaled
    ? card.data().native.cover.scaled.slice(-1)[0].url
    : null;

  return (
    <Box className={classes.root} display='flex'>
      <Card
        style={{
          height: '100%',
          width: '100%',
          overflow: 'hidden',
          overflowY: 'auto',
          borderRadius: 0
        }}
      >
        <CardHeader
          avatar={
            <Avatar aria-label='recipe'>
              <img src={board.data().logo} className={classes.avatar} />
            </Avatar>
          }
          // action={
          //   <IconButton aria-label='settings'>
          //     <KebabIcon size={24} />
          //   </IconButton>
          // }
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
        {coverImg && (
          <img
            className={classes.media}
            src={coverImg}
            // title={card.name}
          />
        )}
        <Box px={2} py={1}>
          <Typography className={classes.capitalize}>
            {card.data().native.name}
          </Typography>
        </Box>
        <Box px={2} py={1} display='flex'>
          <Label
            txt={card.data().reward}
            icon={<RewardIcon size={18} />}
            color={theme.palette.secondary.main}
          />
          <Label
            txt={<span style={{ paddingLeft: 4 }}>{card.data().timebox}</span>}
            icon={<TimeboxIcon size={20} />}
            color={theme.palette.secondary.dark}
          />
        </Box>
        <Box p={2}>
          <ReactMarkdown>{card.data().native.desc}</ReactMarkdown>
        </Box>
      </Card>
    </Box>
  );
}

export default CardDetails;
