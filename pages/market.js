import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { Button, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  sideBar: {
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    height: '100vh'
  },
  content: {
    height: '100vh'
  }
}));

export default function Timebox() {
  const classes = useStyles();
  // const theme = useTheme();
  // const [timebox, setTimebox] = useState(5);
  // const [t, setT] = useState();
  console.log('timebox');

  // useEffect(() => {
  //   const _t = window.TrelloPowerUp.iframe();
  //   setT(_t);
  //   setTimebox(_t.arg('timebox') || 5);
  // }, []);

  return (
    <Grid
      container
      direction='row'
      justify='flex-start'
      alignItems='flex-start'
      className={classes.checkList}
    >
      <Grid item xs={2} className={classes.sideBar}>
        SideBar
      </Grid>
      <Grid item xs={10} className={classes.content}>
        Content
      </Grid>
    </Grid>
  );
}
