import React, { useState, useEffect } from 'react';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
  withStyles
} from '@material-ui/core/styles';
import {
  TextField,
  Button,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  FormControlLabel
} from '@material-ui/core';
import NumberFormat from 'react-number-format';

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
  input: {
    marginBottom: theme.spacing(2)
  },
  radioGroup: {
    marginBottom: theme.spacing(2)
  }
}));

function NumberFormatCustom(props) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
      prefix='$'
    />
  );
}

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

export default function AddReward() {
  const classes = useStyles();
  const [reward, setReward] = useState(0);
  const [timebox, setTimebox] = useState(5);
  // const theme = useTheme();
  // theme.palette.type = 'light';

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    if (_t.arg('data')) {
      setReward(_t.arg('data').reward);
      setTimebox(_t.arg('data').timebox);
    }
  }, []);

  async function submit() {
    const _t = window.TrelloPowerUp.iframe();
    await _t.arg('ref').set({
      reward,
      timebox
    });
    _t.notifyParent('done');
  }

  return (
    <ThemeProvider theme={theme}>
      <FormControl className={classes.root}>
        <Box className={classes.root} display='flex' flexDirection='column'>
          <TextField
            label='Reward'
            value={reward}
            onChange={(e) => {
              setReward(e.target.value);
            }}
            name='reward'
            id='reward-input'
            className={classes.input}
            fullWidth
            InputProps={{
              inputComponent: NumberFormatCustom
            }}
          />
          <FormLabel
            component='label'
            style={{ color: theme.palette.text.dark }}
          >
            Timebox
          </FormLabel>
          <RadioGroup
            aria-label='timebox'
            name='timebox'
            value={timebox}
            onChange={(e) => {
              setTimebox(parseInt(e.target.value, 10));
            }}
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
            variant='contained'
            color='primary'
            onClick={submit}
            fullWidth
          >
            Publish
          </Button>
        </Box>
      </FormControl>
    </ThemeProvider>
  );
}
