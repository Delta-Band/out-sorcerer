import React, { useState, useEffect } from 'react';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { TextField, Button, Box } from '@material-ui/core';
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

export default function AddReward() {
  const classes = useStyles();
  const [value, setValue] = useState(0);
  const [t, setT] = useState();
  // const theme = useTheme();
  // theme.palette.type = 'light';

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setValue(_t.arg('reward'));
  }, []);

  function handleChange(event) {
    setValue(event.target.value);
  }

  const submit = () => {
    t.set('card', 'shared', 'reward', value);
    t.notifyParent('done', { value });
  };

  return (
    <ThemeProvider theme={theme}>
      <Box className={classes.root}>
        <TextField
          label='Reward'
          value={value}
          onChange={handleChange}
          name='reward'
          id='reward-input'
          className={classes.input}
          fullWidth
          InputProps={{
            inputComponent: NumberFormatCustom
          }}
        />
        <br />
        <Button variant='contained' color='primary' onClick={submit} fullWidth>
          Submit
        </Button>
      </Box>
    </ThemeProvider>
  );
}
