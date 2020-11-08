import React from 'react';
import cx from 'classnames';
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles
} from '@material-ui/core/styles';
import { Box } from '@material-ui/core';

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
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0
  },
  marginBottom: {
    marginBottom: theme.spacing(2)
  }
}));

const OSLists = [
  'Market',
  'Starred',
  'Claim',
  'Approved',
  'Client Review',
  'Done',
  'Paid'
];

export default function AddReward() {
  const classes = useStyles();

  return (
    <ThemeProvider theme={theme}>
      <Box
        className={cx(classes.root, classes.marginBottom)}
        display='flex'
        flexDirection='column'
      >
        <div>We added the follwing lists to your board:</div>
        <ul className={cx(classes.list, classes.marginBottom)}>
          {OSLists.map((listName) => (
            <li key={listName}>{listName}</li>
          ))}
        </ul>
        <div className={classes.marginBottom}>
          Do not archive these lists. they are used for handling your card flow.
        </div>
        <div className={classes.marginBottom}>
          You can add any additional lists you want.
        </div>
        <div className={classes.marginBottom}>
          If you remove one of our generated lists re-enable the power up or
          re-add them manualy
        </div>
      </Box>
    </ThemeProvider>
  );
}
