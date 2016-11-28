import React, {Component} from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

/* -----------------    DUMB COMPONENT     ------------------ */

class GuestPlayer extends React.Component {

  constructor(props) {
      super(props);
      this.mapDurationSecsToMins = this.mapDurationSecsToMins.bind(this)

      const { currentSong } = this.props;
      console.log("THIS PROPS: ", this.props);
      console.log("CURRENT SONG: ", currentSong);
  }

  mapDurationSecsToMins(num) {
    let mins = Math.floor(num / 60);
    let secs = num % 60;
    return `${mins}:${secs}`
  }

  /*
  title,
  artist,
  artwork,
  DJ,
    up/down votes
  */

  
  render() {
    return (
      <div className="guest-player-container">
        <FontIcon className="zmdi zmdi-hearing animated infinite pulse" />
        <h4 className="guest-player-text"> Song: { currentSong.title } </h4>
        <h4 className="guest-player-text"> Artist: { currentSong.artist } </h4>
        <h4 className="guest-player-text"> DJ: { currentSong.dj_name } </h4>
        <div>
          <h4 className="guest-player-text">Heat: { currentSong.vote_priority } </h4>
          <IconButton iconClassName="zmdi zmdi-fire" />
          <IconButton iconClassName="zmdi zmdi-thumb-down" />
        </div>
      </div>
    );

  }

};

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong }) => ({ currentSong });

export default connect(mapStateToProps)(GuestPlayer);
