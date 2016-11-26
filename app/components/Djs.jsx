import React, {Component} from 'react';
import { connect } from 'react-redux';

import DjList from './DjsList'

/* -----------------    DUMB COMPONENT     ------------------ */

const DjsComponent = props => {
  const { djs, user } = props;
  const djPoints = djs[user.uid] && djs[user.uid].dj_points;
  delete djs[user.uid];
  return (
    <div>
      <h1>Your DJ Data</h1>
      <p>DJ {user.displayName}</p>
      <p>Points: {djPoints}</p>
      <hr/>
      <h1> Party DJs</h1>
      <DjList djs={djs}/>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user, djs }) => ({ firebase, user, djs });

export default connect(mapStateToProps)(DjsComponent);

