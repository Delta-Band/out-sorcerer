import React, { useState, useEffect } from 'react';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  radioGroup: {
    marginBottom: theme.spacing(1)
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
  const theme = useTheme();
  const [userType, setUserType] = useState(5);
  const [t, setT] = useState();
  console.log('timebox');

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setUserType(_t.arg('userType') || 5);
  }, []);

  const confirm = () => {
    t.set('board', 'shared', 'userType', userType);
    t.notifyParent('done');
  };

  function handleChange(e) {
    setUserType(e.target.value);
  }

  return (
    <FormControl style={theme.frameWrapper}>
      <FormLabel component='label'>User Type</FormLabel>
      <RadioGroup
        aria-label='timebox'
        name='timebox'
        value={userType}
        onChange={handleChange}
        className={classes.radioGroup}
      >
        <FormControlLabel
          value='pusher'
          control={<BlueRadio />}
          label='Pusher'
        />
        <FormControlLabel
          value='publisher'
          control={<BlueRadio />}
          label='Publisher'
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
  );
}
