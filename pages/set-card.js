import React, { useState, useEffect } from 'react';
import firebase from 'firebase';
import cx from 'classnames';
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
    width: '100%',
    boxSizing: 'border-box',
    padding: theme.spacing(1)
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  },
  input: {
    '& input': {
      paddingTop: 12.5,
      paddingBottom: 12.5
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
  const db = firebase.firestore();
  const classes = useStyles();
  const [fireCardRef, setFireCardRef] = useState();
  const [disableUnpublish, setDisableUnpublish] = useState(true);
  const [data, setData] = useState({
    reward: 0,
    timebox: 5
  });
  // const theme = useTheme();
  // theme.palette.type = 'light';

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setFireCardRef(
      db
        .collection('boards')
        .doc(_t.arg('marketName') || 'delta band')
        .collection('cards')
        .doc(_t.arg('cardId') || 'vvVqKVLw')
    );
  }, []);

  useEffect(() => {
    if (fireCardRef) {
      getCardData();
    }
  }, [fireCardRef]);

  async function getCardData() {
    const fireCard = await fireCardRef.get();
    const fireCardData = fireCard.data();
    setData({
      ...data,
      ...fireCardData
    });
    if (fireCardData.published) {
      setDisableUnpublish(false);
    }
  }

  async function publish() {
    const _t = window.TrelloPowerUp.iframe();
    const published = data.published;
    if (published) {
      await fireCardRef.set({ ...data, published: Date.now() });
    } else {
      await fireCardRef.set({ ...data });
    }
    setDisableUnpublish(false);
    _t.notifyParent('done');
  }

  async function unpublish() {
    setDisableUnpublish(true);
    const _t = window.TrelloPowerUp.iframe();
    await fireCardRef.delete();
    _t.notifyParent('done');
  }

  return (
    <ThemeProvider theme={theme}>
      <FormControl className={classes.root}>
        <Box className={classes.root} display='flex' flexDirection='column'>
          <TextField
            label='Reward'
            variant='outlined'
            value={data.reward}
            onChange={(e) => {
              setData({
                ...data,
                reward: e.target.value
              });
            }}
            name='reward'
            id='reward-input'
            className={cx(classes.marginBottom, classes.input)}
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
            value={data.timebox}
            onChange={(e) => {
              setData({
                ...data,
                timebox: parseInt(e.target.value, 10)
              });
            }}
            className={classes.marginBottom}
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
            onClick={publish}
            fullWidth
            disabled={!(data.reward > 0)}
            className={classes.marginBottom}
          >
            Publish
          </Button>
          <Button
            variant='contained'
            color='primary'
            onClick={unpublish}
            fullWidth
            disabled={Boolean(disableUnpublish)}
          >
            Unpublish
          </Button>
        </Box>
      </FormControl>
    </ThemeProvider>
  );
}
