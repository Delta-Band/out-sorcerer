import React, { Fragment, useState } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { format } from 'timeago.js';
import StackGrid from 'react-stack-grid';
import Tippy from '@tippyjs/react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { MoreVertical as KebabIcon } from '@styled-icons/evaicons-solid/MoreVertical';
import { Organization as OrgIcon } from '@styled-icons/octicons/Organization';
import { Dollar as RewardIcon } from '@styled-icons/boxicons-regular/Dollar';
import { BusinessTime as TimeboxIcon } from '@styled-icons/fa-solid/BusinessTime';
import grey from '@material-ui/core/colors/grey';
import CardDetails from './card-details';
import {
  Box,
  Card,
  CardHeader,
  Avatar,
  Button,
  Typography
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  fullHeight: {
    height: '100%',
    boxSizing: 'border-box'
  },
  card: {
    paddingBottom: theme.spacing(1),
    cursor: 'pointer',
    boxSizing: 'border-box',
    border: `1px solid ${grey['800']}`,
    '& .MuiCardHeader-title': {
      textTransform: 'capitalize'
    }
  },
  selected: {
    borderColor: theme.palette.secondary.main
  },
  avatar: {
    objectFit: 'cover',
    width: '100%',
    height: '100%'
  },
  media: {
    width: `calc(100% - ${theme.spacing(2)}px)`,
    transform: `translateX(${theme.spacing(1)}px)`,
    borderRadius: 10,
    overflow: 'hidden'
  },
  grid: {
    width: '100%',
    marginBottom: theme.spacing(3),
    overflow: 'hidden',
    overflowY: 'auto'
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  label: {
    marginRight: theme.spacing(3)
  }
}));

function Label(props) {
  const { txt, icon, color } = props;
  const classes = useStyles();

  return (
    <Box
      display='flex'
      alignItems='center'
      className={classes.label}
      borderRadius={25}
      style={{
        color: color
      }}
    >
      {icon}
      {/* <Box width={theme.spacing(0.5)}></Box> */}
      <Box>
        <Typography variant='caption'>{txt}</Typography>
      </Box>
    </Box>
  );
}

function AllCards(props) {
  const { cards, boards, value, index, ...other } = props;
  const classes = useStyles();
  const theme = useTheme();
  const [gridRef, setGridRef] = useState();
  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedBoard, setSelectedBoard] = useState();

  // useEffect(() => {
  //   if (gridRef && window.TrelloCards) {
  //     window.TrelloCards.load();
  //     setTimeout(function () {
  //       gridRef.updateLayout();
  //     }, 3000);
  //   }
  // }, [gridRef]);

  function onCardClick(i) {
    setSelectedCard(i);
  }

  if (boards.length === 0) return null;

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      display='flex'
      justifyContent='space-between'
      // style={{
      //   width: '100%'
      // }}
      {...other}
    >
      {value === index && (
        <Fragment>
          <Box
            p={3}
            className={cx(
              classes.fullHeight,
              classes.padingTopCompensationForFooter
            )}
            style={{
              width: 'calc(100vw - 600px)'
            }}
          >
            {boards.length === 0 ? (
              'Loading...'
            ) : (
              <StackGrid
                columnWidth='33.33%'
                className={classes.grid}
                enableSSR
                horizontal
                monitorImagesLoaded
                gridRef={(grid) => {
                  setGridRef(grid);
                }}
              >
                {cards.map((card, i) => {
                  const data = card.data();
                  const board = boards.find(
                    (board) => board.data().boardId === data.boardId
                  );
                  // if (i === 0 && selectedBoard !== 0) {
                  //   setSelectedBoard(board);
                  // }
                  const coverImg = data.native.cover.scaled
                    ? data.native.cover.scaled.slice(-1)[0].url
                    : null;
                  return (
                    <div key={card.id}>
                      <Card
                        className={cx(classes.card, {
                          [classes.selected]: i === selectedCard
                        })}
                        onClick={function () {
                          setSelectedCard(i);
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Tippy
                              interactive
                              placement='bottom'
                              theme='light'
                              content={
                                <Box
                                  display='flex'
                                  flexDirection='column'
                                  style={{
                                    lineHeight: '2em',
                                    padding: 10
                                  }}
                                >
                                  <Box display='flex' alignItems='center'>
                                    <OrgIcon
                                      size={15}
                                      style={{ transform: 'translateY(-1px)' }}
                                    />
                                    <Box width={10} />
                                    <Box className={classes.capitalize}>
                                      {board.id}
                                    </Box>
                                  </Box>
                                  <Button
                                    variant='contained'
                                    color='secondary'
                                    fullWidth
                                    onClick={function () {
                                      window.open(
                                        board.data().webPage,
                                        '_blank'
                                      );
                                    }}
                                    style={{
                                      marginTop: 5
                                    }}
                                  >
                                    About us
                                  </Button>
                                </Box>
                              }
                            >
                              <Avatar aria-label='recipe'>
                                <img
                                  src={board.data().logo}
                                  className={classes.avatar}
                                />
                              </Avatar>
                            </Tippy>
                          }
                          // action={
                          //   <IconButton aria-label='settings'>
                          //     <KebabIcon size={24} />
                          //   </IconButton>
                          // }
                          title={board.id}
                          subheader={
                            <Box
                              display='flex'
                              alignItems='center'
                              style={{ marginTop: 4 }}
                            >
                              {/* <PublishedIcon
                            size={18}
                            style={{ transform: 'translateY(-1px)' }}
                          />
                          <Box width={10} /> */}
                              <div>{format(data.published)}</div>
                            </Box>
                          }
                        />
                        {coverImg && (
                          <img
                            className={classes.media}
                            src={coverImg}
                            // title={card.name}
                          />
                        )}
                        <Box px={2} py={1}>
                          <Typography className={classes.capitalize}>
                            {data.native.name}
                          </Typography>
                        </Box>
                        <Box px={2} py={1} display='flex'>
                          <Label
                            txt={data.reward}
                            icon={<RewardIcon size={18} />}
                            color={theme.palette.secondary.main}
                          />
                          <Label
                            txt={
                              <span style={{ paddingLeft: 4 }}>
                                {data.timebox}
                              </span>
                            }
                            icon={<TimeboxIcon size={20} />}
                            color={theme.palette.secondary.dark}
                          />
                        </Box>
                      </Card>
                    </div>
                  );
                })}
              </StackGrid>
            )}
          </Box>
          <CardDetails card={cards[selectedCard]} boards={boards} />
        </Fragment>
      )}
    </Box>
  );
}

AllCards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default AllCards;
