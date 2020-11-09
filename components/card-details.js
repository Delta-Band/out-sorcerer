import React, { useEffect, useState } from 'react';
import cx from 'classnames';
import { format } from 'timeago.js';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import grey from '@material-ui/core/colors/grey';
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
    height: '100%',
    width: 600,
    backgroundColor: grey['800']
  }
}));

function CardDetails(props) {
  const classes = useStyles();
  const theme = useTheme();

  return (
    <Box className={classes.root} flexShrink={0}>
      Card Details
    </Box>
  );
}

export default CardDetails;
