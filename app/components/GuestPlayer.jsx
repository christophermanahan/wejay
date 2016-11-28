import React, {Component} from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';


// import LinearProgress from 'material-ui/LinearProgress';


/* -----------------    DUMB COMPONENT     ------------------ */

const GuestPlayer = props => {
  const { currentSong } = props;


  return (
    <div>



      <FontIcon className="zmdi zmdi-hearing animated infinite pulse" />
      <h4> Song: { currentSong.title } </h4>
      <h4> Artist: { currentSong.artist } </h4>
      <h4> DJ: { currentSong.dj_name } </h4>
      <div>
        <h4 className="guest-player-text">Heat: { currentSong.vote_priority } </h4>
        <IconButton iconClassName="zmdi zmdi-fire" />
        <IconButton iconClassName="zmdi zmdi-thumb-down" />
      </div>
    </div>
  );
};

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong }) => ({ currentSong });

export default connect(mapStateToProps)(GuestPlayer);
