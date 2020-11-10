import React, { Fragment, useState, useCallback } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { format } from 'timeago.js';
import StackGrid from 'react-stack-grid';
import Tippy from '@tippyjs/react';
import { HandSparkles as ClaimedIcon } from '@styled-icons/fa-solid/HandSparkles';
import { makeStyles, useTheme } from '@material-ui/core/styles';
// import { MoreVertical as KebabIcon } from '@styled-icons/evaicons-solid/MoreVertical';
import { Organization as OrgIcon } from '@styled-icons/octicons/Organization';
import { Dollar as RewardIcon } from '@styled-icons/boxicons-regular/Dollar';
import { BusinessTime as TimeboxIcon } from '@styled-icons/fa-solid/BusinessTime';
import { Modal, ModalGateway } from 'react-images';
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

function Cards(props) {
  const { user, cards, boards, value, index, ...other } = props;
  // console.log('user: ', user);
  const classes = useStyles();
  const theme = useTheme();
  const [gridRef, setGridRef] = useState();
  // const [currentImage, setCurrentImage] = useState(0);
  const [viewerIsOpen, setViewerIsOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState();
  // const [selectedBoard, setSelectedBoard] = useState();

  // useEffect(() => {
  //   if (gridRef && window.TrelloCards) {
  //     window.TrelloCards.load();
  //     setTimeout(function () {
  //       gridRef.updateLayout();
  //     }, 3000);
  //   }
  // }, [gridRef]);

  const openLightbox = useCallback((event) => {
    setViewerIsOpen(true);
  }, []);

  const closeLightbox = () => {
    setViewerIsOpen(false);
  };

  if (boards.length === 0) return null;

  return (
    <Box
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      display='flex'
      justifyContent='space-between'
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
              width: '100vw'
            }}
          >
            {boards.length === 0 ? (
              'Loading...'
            ) : (
              <StackGrid
                columnWidth='20%'
                className={classes.grid}
                enableSSR
                horizontal
                monitorImagesLoaded
                gridRef={(grid) => {
                  setGridRef(grid);
                }}
              >
                {cards.map((card, i) => {
                  const board = boards.find(
                    (board) => board.id === card.data().boardId
                  );
                  const coverImg = card.data().native.cover.scaled
                    ? card.data().native.cover.scaled.slice(-1)[0].url
                    : null;
                  return (
                    <div key={card.id}>
                      <Card
                        className={cx(classes.card, {
                          [classes.selected]: i === selectedCard
                        })}
                        onClick={function () {
                          setSelectedCard(i);
                          openLightbox();
                        }}
                      >
                        <CardHeader
                          avatar={
                            <Avatar aria-label='recipe'>
                              <img
                                src={board.data().logo}
                                className={classes.avatar}
                              />
                            </Avatar>
                          }
                          title={board.data().name}
                          subheader={
                            <Box
                              display='flex'
                              alignItems='center'
                              style={{ marginTop: 4 }}
                            >
                              <div>{format(card.data().published)}</div>
                            </Box>
                          }
                        />
                        {coverImg && (
                          <img className={classes.media} src={coverImg} />
                        )}
                        <Box px={2} py={1}>
                          <Typography className={classes.capitalize}>
                            {card.data().native.name}
                          </Typography>
                        </Box>
                        <Box px={2} py={1} display='flex'>
                          <Label
                            txt={card.data().reward}
                            icon={<RewardIcon size={18} />}
                            color={theme.palette.secondary.main}
                          />
                          <Label
                            txt={
                              <span style={{ paddingLeft: 4 }}>
                                {card.data().timebox}
                              </span>
                            }
                            icon={<TimeboxIcon size={20} />}
                            color={theme.palette.secondary.main}
                          />
                          {card.data().claims.includes(user) && (
                            <ClaimedIcon
                              size={20}
                              color={theme.palette.secondary.main}
                            />
                          )}
                        </Box>
                      </Card>
                    </div>
                  );
                })}
              </StackGrid>
            )}
          </Box>
          <ModalGateway>
            {viewerIsOpen ? (
              <Modal>
                <CardDetails
                  card={cards[selectedCard]}
                  boards={boards}
                  closeLightbox={closeLightbox}
                  user={user}
                />
              </Modal>
            ) : null}
          </ModalGateway>
        </Fragment>
      )}
    </Box>
  );
}

Cards.propTypes = {
  cards: PropTypes.arrayOf(PropTypes.object),
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};

export default Cards;
