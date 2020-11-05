import React, { useState, useEffect } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Box
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: 280,
    boxSizing: 'border-box',
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary
  },
  radioGroup: {
    marginBottom: theme.spacing(2)
  }
}));

const BlueRadio = withStyles(
  (theme) => ({
    root: {
      // color: green[400],
      '&$checked': {
        color: theme.palette.primary.main
      }
    },
    checked: {}
  }),
  { withTheme: true }
)((props) => <Radio color='default' {...props} />);

export default function Timebox() {
  const classes = useStyles();
  // const theme = useTheme();
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
    setTimebox(parseInt(e.target.value, 10));
  }

  return (
    <Box className={classes.root}>
      <FormControl>
        <FormLabel component='label'>Timebox</FormLabel>
        <RadioGroup
          aria-label='timebox'
          name='timebox'
          value={timebox}
          onChange={handleChange}
          className={classes.radioGroup}
        >
          <FormControlLabel
            value={5}
            control={<BlueRadio />}
            label='5 Work Days'
          />
          <FormControlLabel
            value={10}
            control={<BlueRadio />}
            label='10 Work Days'
          />
          <FormControlLabel
            value={15}
            control={<BlueRadio />}
            label='15 Work Days'
          />
        </RadioGroup>
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
    </Box>
  );
}
