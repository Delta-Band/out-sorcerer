import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles, useTheme, withStyles } from '@material-ui/core/styles';
import { UserNinja as PusherIcon } from '@styled-icons/fa-solid/UserNinja';
import { UserTie as ProviderIcon } from '@styled-icons/fa-solid/UserTie';
import {
  Button,
  // FormControl,
  // FormLabel,
  // RadioGroup,
  // FormControlLabel,
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
    height: '100%',
    '& .react-swipeable-view-container': {
      height: '100%'
    }
  },
  fullHeight: {
    height: '100%'
  },
  typeBox: {
    cursor: 'pointer',
    transition: '.5s ease-in-out'
    // '&:hover': {
    //   borderColor: theme.palette.secondary.main,
    //   color: theme.palette.secondary.main
    // }
  },
  active: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          p={3}
          display='flex'
          alignItems='center'
          justifyContent='center'
          className={classes.fullHeight}
        >
          {children}
        </Box>
      )}
    </div>
  );
}

function TypeBox(props) {
  const { title, children, active, onClick } = props;
  const classes = useStyles();

  return (
    <Box
      p={3}
      m={3}
      border={2}
      borderColor='grey.500'
      borderRadius='50%'
      width={120}
      height={120}
      boxShadow={3}
      justifyContent='center'
      alignItems='center'
      display='flex'
      flexDirection='column'
      bgcolor='grey.900'
      className={cx(classes.typeBox, { [classes.active]: active })}
      onClick={onClick}
    >
      {children}
      <Typography variant='caption' style={{ marginTop: '6px' }}>
        {title}
      </Typography>
    </Box>
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
  const [userType, setUserType] = useState('pusher');
  const [tab, setTab] = useState(0);
  const [t, setT] = useState();
  console.log('timebox');

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setUserType(_t.arg('userType') || 'pusher');
  }, []);

  const save = () => {
    t.set('board', 'shared', 'userType', userType);
    t.notifyParent('done');
  };

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
        className={cx(classes.swipeableViews, classes.fullHeight)}
      >
        <TabPanel
          value={tab}
          index={0}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          <TypeBox
            title='PROVIDER'
            active={userType === 'provider'}
            onClick={() => {
              setUserType('provider');
            }}
          >
            <ProviderIcon />
          </TypeBox>
          <TypeBox
            title='PUSHER'
            active={userType === 'pusher'}
            onClick={() => {
              setUserType('pusher');
            }}
          >
            <PusherIcon />
          </TypeBox>
          {/* <FormLabel component='label' color='secondary'>
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
          </RadioGroup> */}
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
