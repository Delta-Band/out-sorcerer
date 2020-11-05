import React, { useState, useEffect } from 'react';
import {
  makeStyles,
  withStyles,
  createMuiTheme,
  ThemeProvider
} from '@material-ui/core/styles';
import {
  Button,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel,
  Radio
} from '@material-ui/core';

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
  radioGroup: {
    marginBottom: theme.spacing(2)
  }
}));

const BlueRadio = withStyles(
  (theme) => ({
    root: {
      // color: theme.palette.text.dark,
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

  async function confirm() {
    await t.set('card', 'shared', 'timebox', timebox);
    t.notifyParent('done');
  }

  function handleChange(e) {
    setTimebox(parseInt(e.target.value, 10));
  }

  return (
    <ThemeProvider theme={theme}>
      <FormControl className={classes.root}>
        <FormLabel component='label' style={{ color: theme.palette.text.dark }}>
          Timebox
        </FormLabel>
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
    </ThemeProvider>
  );
}
