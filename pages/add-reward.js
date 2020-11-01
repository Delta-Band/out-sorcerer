import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { TextField, Button } from '@material-ui/core';
import NumberFormat from 'react-number-format';
import { card } from '../store';

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
  const reward = useSelector(card.selectors.reward);
  const dispatch = useDispatch();

  function handleChange(event) {
    dispatch(card.actions.update({ reward: event.target.value }));
  }

  function submitReward() {
    window.TrelloPowerUp.iframe().set('card', 'shared', 'reward', reward);
    window.TrelloPowerUp.iframe().notifyParent('done');
  }

  return (
    <div className={classes.root}>
      <TextField
        label='Reward'
        value={reward}
        onChange={handleChange}
        name='reward'
        id='reward-input'
        InputProps={{
          inputComponent: NumberFormatCustom
        }}
      />
      <br />
      <Button variant='contained' color='primary' onClick={submitReward}>
        Primary
      </Button>
    </div>
  );
}
