import React, { useState, useEffect } from 'react';
import SwipeableViews from 'react-swipeable-views';
// import fetch from 'node-fetch';
import cx from 'classnames';
import PropTypes from 'prop-types';
import firebase from 'firebase';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { UserNinja as PusherIcon } from '@styled-icons/fa-solid/UserNinja';
import { UserTie as ProviderIcon } from '@styled-icons/fa-solid/UserTie';
import {
  Button,
  TextField,
  // Radio,
  Tabs,
  Tab,
  AppBar,
  Box,
  Typography,
  InputAdornment
  // InputLabel,
  // Select,
  // MenuItem
} from '@material-ui/core';
// import { TRELLO_API_KEY, TRELLO_API_TOKEN } from '../secrets';

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
  },
  padingTopCompensationForFooter: {
    paddingTop: '84px'
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

// const BlueRadio = withStyles(
//   (theme) => ({
//     root: {
//       // color: green[400],
//       '&$checked': {
//         color: theme.palette.secondary.main
//       }
//     },
//     checked: {}
//   }),
//   { withTheme: true }
// )((props) => <Radio color='default' {...props} />);

export default function Settings() {
  const classes = useStyles();
  const theme = useTheme();
  const [userType, setUserType] = useState('pusher');
  const [marketName, setMarketName] = useState('');
  const [webPage, setWebPage] = useState('');
  const [logo, setLogo] = useState('');
  const [saved, setSaved] = useState(false);
  const [marketNames, setMarketNames] = useState([]);
  const [tab, setTab] = useState(1);
  const db = firebase.firestore();
  const [t, setT] = useState();
  console.log('timebox');
  const urlPattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  );

  // async function getAdmins(_t) {
  //   const boardId =
  //     typeof _t.args === 'function'
  //       ? _t.args('context').board
  //       : '5f997e95e7a26e14b2b4c3ca';
  //   const resp = await fetch(
  //     `https://api.trello.com/1/boards/${boardId}/members?key=${TRELLO_API_KEY}&token=${TRELLO_API_TOKEN}&filter=admins`
  //   );
  //   const admins = await resp.json();
  //   setAdmins(admins);
  // }

  async function getBoardIds() {
    const snapshot = await db.collection('boards').get();
    const _marketNames = snapshot.docs.reduce((accumulator, doc) => {
      accumulator.push(doc.id);
      return accumulator;
    }, []);
    setMarketNames(_marketNames);
  }

  useEffect(() => {
    const _t = window.TrelloPowerUp.iframe();
    setT(_t);
    setUserType(_t.arg('userType') || 'pusher');
    setMarketName(_t.arg('marketName') || '');
    setWebPage(_t.arg('webPage') || '');
    setLogo(_t.arg('logo') || '');
    // getAdmins(_t);
    getBoardIds();
  }, []);

  useEffect(() => {
    if (!t) {
      return;
    }
    if (t.arg('userType') !== userType) {
      setMarketName('');
      setWebPage('');
      setLogo('');
    } else {
      setMarketName(t.arg('marketName') || '');
      setWebPage(t.arg('webPage') || '');
      setLogo(t.arg('logo') || '');
    }
  }, [userType]);

  async function save() {
    await db
      .collection(userType === 'provider' ? 'boards' : 'pushers')
      .doc(marketName.toLowerCase())
      .set(
        {
          webPage,
          logo,
          boardId: t.args('context').board
        },
        { merge: true }
      );
    if (
      (t.arg('marketName') && t.arg('marketName') !== marketName) ||
      (t.arg('userType') && t.arg('userType') !== userType)
    ) {
      // delete old document
      await db
        .collection(t.arg('userType') === 'provider' ? 'boards' : 'pushers')
        .doc(t.arg('marketName').toLowerCase())
        .delete();
    }
    t.set('board', 'shared', 'userType', userType);
    t.set('board', 'shared', 'marketName', marketName);
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

  function handleMarkeNameChange(event) {
    console.log(event.target.value);
    setMarketName(event.target.value);
    setSaved(false);
  }

  function handleWebPageChange(event) {
    console.log(event.target.value);
    setWebPage(event.target.value);
    setSaved(false);
  }

  function handleLogoChange(event) {
    console.log(event.target.value);
    setLogo(event.target.value);
    setSaved(false);
  }

  function hasChanged() {
    console.log('check has changed');
    const hasChanged =
      t &&
      (t.arg('userType') !== userType ||
        t.arg('marketName') !== marketName ||
        t.arg('webPage') !== webPage ||
        t.arg('logo') !== logo);
    console.log('hasChanged', hasChanged);
    return hasChanged;
  }

  function isValid() {
    const isValid =
      marketName.length > 3 &&
      urlPattern.test(webPage) &&
      urlPattern.test(logo);
    console.log('isValid', isValid);
    return isValid;
  }

  function marketNameTaken() {
    if (!t || t.arg('marketName') === marketName) return false;
    const found = marketNames.find((name) => name === marketName.toLowerCase());
    return found;
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
        </TabPanel>
        <TabPanel
          value={tab}
          index={1}
          dir={theme.direction}
          className={classes.fullHeight}
        >
          <Box width={350}>
            <TextField
              label='Market Name'
              value={marketName}
              onChange={handleMarkeNameChange}
              name='marketName'
              id='marketName'
              className={classes.input}
              inputProps={{
                maxLength: 25,
                startAdornment: (
                  <InputAdornment position='start'>
                    {userType === 'pusher' ? <PusherIcon /> : <ProviderIcon />}
                  </InputAdornment>
                )
              }}
              fullWidth
              error={
                marketNameTaken() ||
                (marketName.length < 4 && marketName.length > 0)
              }
              helperText={
                marketName.length < 4 && marketName.length > 0
                  ? 'Should be at least 4 charecters'
                  : marketNameTaken()
                  ? 'Market Name taken.'
                  : userType === 'pusher'
                  ? 'This is your unique user-name for the Out-Sourcerer market'
                  : 'This is your unique board name for the Out-Sourcerer market'
              }
            />
            <br />
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
            {/* <InputLabel id='demo-simple-select-label'>Age</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='handler-simple-select'
              value={age}
              onChange={handleHandlerChange}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select> */}
            {/* <TextField
              label='Handler Name'
              value={marketName}
              onChange={handleMarkeNameChange}
              name='marketName'
              id='marketName'
              className={classes.input}
              inputProps={{
                maxLength: 25
              }}
              fullWidth
            /> */}
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
      </Box>
    </Box>
  );
}
