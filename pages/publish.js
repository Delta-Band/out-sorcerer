import React from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { CheckCircle as Check } from '@styled-icons/boxicons-solid/CheckCircle';
import { ErrorCircle as Error } from '@styled-icons/boxicons-solid/ErrorCircle';
// import { card } from '../store';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
  },
  checkList: {
    lineHeight: '2em'
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
  // const cardData = useSelector(card.selectors.data);
  // const dispatch = useDispatch();

  function confirm() {
    window.TrelloPowerUp.iframe().notifyParent('done');
  }

  return (
    <div className={classes.root}>
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
        <Grid item xs={2}>
          <Check className={cx(classes.icon, classes.green)} />
        </Grid>
        <Grid item xs={10}>
          Video
        </Grid>
        <Grid item xs={2}>
          <Error className={cx(classes.icon, classes.red)} />
        </Grid>
      </Grid>
      <Button
        variant='contained'
        color='primary'
        onClick={confirm}
        disabled={true}
      >
        Publish
      </Button>
    </div>
  );
}
