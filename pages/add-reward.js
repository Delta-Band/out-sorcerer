import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import NumberFormat from 'react-number-format';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1)
    }
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
  let t;

  useEffect(() => {
    t = window.TrelloPowerUp.iframe();
    setValue(t.arg('reward'));
  }, []);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function submitReward() {
    t.set('card', 'shared', 'reward', value);
    t.notifyParent('done', { value });
  }

  return (
    <div className={classes.root}>
      <TextField
        label='Reward'
        value={value}
        onChange={handleChange}
        name='reward'
        id='reward-input'
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
      />
      <br />
      <Button variant='contained' color='primary' onClick={submitReward}>
        Submit
      </Button>
    </div>
  );
}
