import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import {
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Tabs,
  Tab,
  AppBar,
  Box,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    width: '100vw',
    height: '100vh'
  },
  radioGroup: {
    marginBottom: theme.spacing(1)
  },
  swipeableViews: {
    height: '100%'
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    'aria-controls': `full-width-tabpanel-${index}`
  };
}

const BlueRadio = withStyles(
  (theme) => ({
    root: {
      // color: green[400],
      '&$checked': {
        color: theme.palette.secondary.main
      }
    },
    checked: {}
  }),
  { withTheme: true }
)((props) => <Radio color='default' {...props} />);

export default function Settings() {
  const classes = useStyles();
  const theme = useTheme();
  const [userType, setUserType] = useState(5);
  const [tab, setTab] = useState(0);
  const [t, setT] = useState();
  console.log('timebox');

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setUserType(_t.arg('userType') || 5);
  }, []);

  const save = () => {
    t.set('board', 'shared', 'userType', userType);
    t.notifyParent('done');
  };

  function handleChange(e) {
    setUserType(e.target.value);
  }

  function handleChangeTabOnSwipe(index) {
    setTab(index);
  }

  function handleChangeTab(event, newValue) {
    setTab(newValue);
  }

  function hasChanged() {
    return t && t.arg('userType') !== userType;
  }

  return (
    <Box className={classes.root} display='flex' flexDirection='column'>
      <AppBar position='static' color='default'>
        <Tabs
          value={tab}
          onChange={handleChangeTab}
          indicatorColor='primary'
          textColor='primary'
          variant='fullWidth'
          aria-label='full width tabs example'
        >
          <Tab label='User Type' {...a11yProps(0)} />
          <Tab label='Info' {...a11yProps(1)} />
          <Tab label='Preferences' {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={tab}
        onChangeIndex={handleChangeTabOnSwipe}
        className={classes.swipeableViews}
      >
        <TabPanel value={tab} index={0} dir={theme.direction}>
          <FormLabel component='label' color='secondary'>
            User Type
          </FormLabel>
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
        </TabPanel>
        <TabPanel value={tab} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={tab} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
      <Box p={3} display='flex' flexDirection='row-reverse'>
        <Button
          variant='contained'
          color='primary'
          onClick={save}
          disabled={hasChanged()}
        >
          SAVE
        </Button>
      </Box>
    </Box>
  );
}
