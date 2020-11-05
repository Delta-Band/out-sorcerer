import React, { useState, useEffect } from 'react';
import cx from 'classnames';
// import firebase from 'firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Box } from '@material-ui/core';
import { CheckCircle as Check } from '@styled-icons/boxicons-solid/CheckCircle';
import { ErrorCircle as Error } from '@styled-icons/boxicons-solid/ErrorCircle';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  checkList: {
    lineHeight: '2em',
    marginBottom: theme.spacing(2)
  },
  icon: {
    width: 25,
    height: 25
  },
  green: {
    color: 'green'
  },
  red: {
    color: 'red'
  }
}));

export default function Publish() {
  const classes = useStyles();
  // const theme = useTheme();
  const [published, setPublished] = useState(false);
  const [reward, setReward] = useState(null);
  const [timebox, setTimebox] = useState(null);
  const [t, setT] = useState();
  // const db = firebase.firestore();

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setPublished(_t.arg('published'));
    setReward(_t.arg('reward'));
    setTimebox(_t.arg('timebox'));
  }, []);

  async function confirm() {
    t.set('card', 'shared', 'published', !published);
    t.notifyParent('done');
  }

  return (
    <Box className={classes.root}>
      <Grid
        container
        direction='row'
        justify='flex-start'
        alignItems='flex-start'
        className={classes.checkList}
      >
        <Grid item xs={10}>
          Reward
        </Grid>
        <Grid item xs='auto'>
          {reward > 0 ? (
            <Check className={cx(classes.icon, classes.green)} />
          ) : (
            <Error className={cx(classes.icon, classes.red)} />
          )}
        </Grid>
        <Grid item xs={10}>
          Timebox
        </Grid>
        <Grid item xs='auto'>
          {timebox > 0 ? (
            <Check className={cx(classes.icon, classes.green)} />
          ) : (
            <Error className={cx(classes.icon, classes.red)} />
          )}
        </Grid>
      </Grid>
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={confirm}
        disabled={false}
      >
        {published ? 'Unpublish' : 'Publish'}
      </Button>
    </Box>
  );
}
