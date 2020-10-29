import { fromJS } from 'immutable';
import React, { useState, useRef, useEffect } from 'react';
import { useScrollPosition } from '@n8tb1t/use-scroll-position';
import { connect } from 'react-redux';

let vh = 0;

const dedup = list => fromJS(list.reduce((uniques, item) => uniques.concat(uniques.includes(item) ? [] : [item]), []));

const reducer = (state = fromJS({
  seen: ['hero']
}), action) => {
  switch (action.type) {
    case 'SECTION:ADD':
      return state.set('seen', dedup(state.get('seen').push(action.name)));
    case 'SECTION:REMOVE':
      return state.set('seen', state.get('seen').filter(itm => itm !== action.name));
    default:
      return state;
  }
};

const actions = {
  setName: name => dispatch => dispatch({
    type: 'SECTION:ADD',
    name
  }),
  removeName: name => dispatch => dispatch({
    type: 'SECTION:REMOVE',
    name
  })
};

const selectors = {
  seen: state => state.getIn(['section', 'seen'])
};

const HOC = (WrappedComponent, id) => {
  const SectionIndicator = (props) => {
    const { setName, removeName, seen } = props;
    const [elementPosition, setElementPosition] = useState({
      x: 0,
      y: 0
    });
    const elementRef = useRef();

    useScrollPosition(
      ({ currPos }) => {
        setElementPosition(currPos);
      },
      [],
      elementRef,
      false,
      300
    );

    useEffect(() => {
      vh = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    }, []);

    useEffect(((_vh) => {
      if (_vh === 0) return;
      if (elementPosition.y < _vh * (1 / 2) && !seen.includes(id)) {
        setName(id);
      } else if (elementPosition.y >= _vh * (1 / 2) && seen.includes(id)) {
        removeName(id);
      }
    }).bind(null, vh));

    return <section ref={elementRef} ><WrappedComponent {...props} /></section >;
  };

  const mapStateToProps = state => ({
    seen: selectors.seen(state)
  });

  const mapDispatchToProps = dispatch => ({
    setReverse: bool => dispatch(actions.setReverse(bool)),
    setName: name => dispatch(actions.setName(name)),
    removeName: name => dispatch(actions.removeName(name))
  });

  return connect(mapStateToProps, mapDispatchToProps)(SectionIndicator);
};

export default {
  reducer,
  actions,
  selectors,
  HOC
};
