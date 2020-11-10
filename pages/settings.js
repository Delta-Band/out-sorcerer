import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
// import fetch from 'node-fetch';
import cx from 'classnames';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserNinja as PusherIcon } from '@styled-icons/fa-solid/UserNinja';
import { UserTie as ProviderIcon } from '@styled-icons/fa-solid/UserTie';
import { ChevronRight } from '@styled-icons/boxicons-regular/ChevronRight';
import { ChevronLeft } from '@styled-icons/boxicons-regular/ChevronLeft';
import {
  Button,
  TextField,
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
  },
  active: {
    borderColor: theme.palette.secondary.main,
    color: theme.palette.secondary.main
  },
  padingTopCompensationForFooter: {
    paddingTop: '55px'
  },
  input: {
    marginBottom: theme.spacing(2)
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
          className={cx(
            classes.fullHeight,
            classes.padingTopCompensationForFooter
          )}
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

export default function Settings() {
  const classes = useStyles();
  const theme = useTheme();
  const [userType, setUserType] = useState('pusher');
  const [webPage, setWebPage] = useState('');
  const [logo, setLogo] = useState('');
  const [saved, setSaved] = useState(false);
  const [tab, setTab] = useState(0);
  const db = firebase.firestore();
  const [t, setT] = useState();
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
    'i'
  );

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setUserType(_t.arg('userType') || 'pusher');
    setWebPage(_t.arg('webPage') || '');
    setLogo(_t.arg('logo') || '');
  }, []);

  useEffect(() => {
    if (!t) {
      return;
    }
    if (t.arg('userType') !== userType) {
      setWebPage('');
      setLogo('');
    } else {
      setWebPage(t.arg('webPage') || '');
      setLogo(t.arg('logo') || '');
    }
  }, [userType]);

  useEffect(() => {
    if (!t) {
      return;
    }
    setSaved(false);
  }, [userType, logo, webPage]);

  async function save() {
    await db
      .collection(userType === 'provider' ? 'boards' : 'pushers')
      .doc(
        t.arg('userType') === 'provider' ? t.arg('board').id : t.arg('userId')
      )
      .set(
        {
          webPage,
          logo,
          name: t.arg('board').name
        },
        { merge: true }
      );
    t.set('board', 'shared', 'userType', userType);
    t.set('board', 'shared', 'webPage', webPage);
    t.set('board', 'shared', 'logo', logo);
    setSaved(true);
  }

  function handleChangeTabOnSwipe(index) {
    setTab(index);
  }

  function handleChangeTab(event, newValue) {
    setTab(newValue);
  }

  function handleWebPageChange(event) {
    setWebPage(event.target.value.trim());
  }

  function handleLogoChange(event) {
    setLogo(event.target.value.trim());
  }

  function hasChanged() {
    if (!t) {
      return false;
    }
    const hasChanged =
      t.arg('userType') !== userType ||
      t.arg('webPage') !== webPage ||
      t.arg('logo') !== logo;
    // console.log('hasChanged', hasChanged);
    if (hasChanged && saved) {
      setSaved(false);
    }
    return hasChanged;
  }

  function isValid() {
    const isValid = urlPattern.test(webPage) && urlPattern.test(logo);
    // console.log('isValid', isValid);
    return isValid;
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
        </TabPanel>
        <TabPanel
          value={tab}
          index={1}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          <Box width={350}>
            <TextField
              label={
                userType === 'pusher'
                  ? 'Linkedin profile page'
                  : 'Product/Company web page'
              }
              value={webPage}
              onChange={handleWebPageChange}
              name='webPage'
              id='webPage'
              className={classes.input}
              fullWidth
              error={!urlPattern.test(webPage) && webPage.length > 0}
              helperText={
                !urlPattern.test(webPage) && webPage.length > 0
                  ? 'Not a valid url.'
                  : userType === 'pusher'
                  ? 'Let providers get to know you'
                  : 'Let pushers get to know your product/company'
              }
            />
            <TextField
              label={
                userType === 'pusher'
                  ? 'Profile pic / logo'
                  : 'Product/Company logo'
              }
              value={logo}
              onChange={handleLogoChange}
              name='logo'
              id='logo'
              className={classes.input}
              fullWidth
              error={!urlPattern.test(webPage) && webPage.length > 0}
              helperText={
                !urlPattern.test(logo) && logo.length > 0
                  ? 'Not a valid url.'
                  : 'Should be a URL to a publicly available image'
              }
            />
          </Box>
        </TabPanel>
        <TabPanel
          value={tab}
          index={2}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          TBD...
        </TabPanel>
      </SwipeableViews>
      <Box p={3} display='flex' flexDirection='row-reverse'>
        <Button
          variant='contained'
          color='primary'
          onClick={save}
          disabled={!hasChanged() || !isValid() || saved}
        >
          {saved ? 'SAVED' : 'SAVE'}
        </Button>
        <Box width={30}></Box>
        <Button
          variant='contained'
          color='primary'
          disabled={tab === 2}
          onClick={() => {
            setTab(tab === 0 ? 1 : 2);
          }}
          endIcon={<ChevronRight size={25} />}
        >
          Next
        </Button>
        <Box width={30}></Box>
        <Button
          variant='contained'
          color='primary'
          disabled={tab === 0}
          onClick={() => {
            setTab(tab === 1 ? 0 : 1);
          }}
          startIcon={<ChevronLeft size={25} />}
        >
          Prev
        </Button>
      </Box>
    </Box>
  );
}
