import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  selectBox: {
    marginBottom: theme.spacing(2)
  }
}));

export default function Timebox() {
  const classes = useStyles();
  const theme = useTheme();
  const [timebox, setTimebox] = useState(5);
  const [t, setT] = useState();
  console.log('timebox');

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setTimebox(_t.arg('timebox') || 5);
  }, []);

  const confirm = () => {
    t.set('card', 'shared', 'timebox', timebox);
    t.notifyParent('done');
  };

  function handleChange(e) {
    setTimebox(e.target.value);
  }

  return (
    <FormControl style={theme.frameWrapper}>
      <InputLabel id='demo-simple-select-label'>Timebox</InputLabel>
      <Select
        labelId='demo-simple-select-label'
        id='demo-simple-select'
        value={timebox}
        onChange={handleChange}
        className={classes.selectBox}
      >
        <MenuItem value={5}>5 Work Days</MenuItem>
        <MenuItem value={10}>10 Work Days</MenuItem>
        <MenuItem value={15}>15 Work Days</MenuItem>
      </Select>
      <Button
        fullWidth
        variant='contained'
        color='primary'
        onClick={confirm}
        disabled={false}
      >
        Confirm
      </Button>
    </FormControl>
  );
}
