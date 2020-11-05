import React, { useState, useEffect } from 'react';
import cx from 'classnames';
// import firebase from 'firebase';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Button, Box } from '@material-ui/core';
import { CheckCircle as Check } from '@styled-icons/boxicons-solid/CheckCircle';
import { ErrorCircle as Error } from '@styled-icons/boxicons-solid/ErrorCircle';

const theme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#b361fe',
      lighter: ''
    },
    secondary: {
      main: '#85ff6e'
    }
  }
});

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    boxSizing: 'border-box',
    padding: theme.spacing(1)
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
    t.set('card', 'shared', 'published', published ? null : new Date());
    t.notifyParent('done');
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        <Box
          fullWidth
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          className={classes.checkList}
        >
          <div>Reward</div>
          <div item xs='auto'>
            {reward > 0 ? (
              <Check className={cx(classes.icon, classes.green)} />
            ) : (
              <Error className={cx(classes.icon, classes.red)} />
            )}
          </div>
        </Box>
        <Box
          fullWidth
          display='flex'
          alignItems='center'
          justifyContent='space-between'
          className={classes.checkList}
          style={{
            marginBottom: theme.spacing(2)
          }}
        >
          <div>Timebox</div>
          <div item xs='auto'>
            {timebox > 0 ? (
              <Check className={cx(classes.icon, classes.green)} />
            ) : (
              <Error className={cx(classes.icon, classes.red)} />
            )}
          </div>
        </Box>
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
    </ThemeProvider>
  );
}
