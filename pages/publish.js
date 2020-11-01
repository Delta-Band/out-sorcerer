import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';
import { CheckCircle as Check } from '@styled-icons/boxicons-solid/CheckCircle';
import { ErrorCircle as Error } from '@styled-icons/boxicons-solid/ErrorCircle';
import { FormatListNumbered } from 'styled-icons/material-twotone';
// import { card } from '../store';

const useStyles = makeStyles((theme) => ({
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
  const theme = useTheme();
  const [published, setPublished] = useState(FormatListNumbered);
  const [t, setT] = useState();

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setPublished(_t.arg('published'));
  }, []);

  const confirm = () => {
    t.set('card', 'shared', 'published', published);
    t.notifyParent('done');
  };

  return (
    <div style={theme.frameWrapper}>
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
          <Check className={cx(classes.icon, classes.green)} />
        </Grid>
        <Grid item xs={10}>
          Video
        </Grid>
        <Grid item xs='auto'>
          <Error className={cx(classes.icon, classes.red)} />
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
    </div>
  );
}
