import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Grid, Button } from '@material-ui/core';
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
  const [value, setValue] = useState(1320);

  function handleChange(event) {
    setValue(event.target.value);
  }

  function submitReward() {
    window.TrelloPowerUp.iframe().set('card', 'shared', 'reward', value);
  }

  return (
    <div className={classes.root}>
      <Grid
        container
        spacing={3}
        direction='column'
        alignItems='center'
        justify='center'
        // style={{ minHeight: '100vh' }}
      >
        <Grid item xs={12}>
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
        </Grid>
        <Grid item xs={12}>
          <Button variant='contained' color='primary' onClick={submitReward}>
            Primary
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}
