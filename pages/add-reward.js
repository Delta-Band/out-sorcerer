import React, { useState, useEffect } from 'react';
import { useTheme } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import NumberFormat from 'react-number-format';

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
  const [value, setValue] = useState(0);
  const [t, setT] = useState();
  const theme = useTheme();

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
    <div style={theme.frameWrapper}>
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
      <Button variant='contained' color='primary' onClick={submit} fullWidth>
        Submit
      </Button>
    </div>
  );
}
