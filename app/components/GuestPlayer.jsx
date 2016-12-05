import React, {Component} from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import LinearProgress from 'material-ui/LinearProgress';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbGuestPlayer = props => {
  const { currentSong, onFire, onWater, uid, hasVotes} = props;
  const ownSong = (uid === (currentSong && currentSong.uid));

  let progBarStyle = {
    backgroundColor: "#EC4616",
    height: ".3em"
  }

  let songInfoColStyle = {
    fontFamily: "Roboto",
    fontSize: "0.5em"
  }

  let titleStyle = {
    fontFamily: "Carme",
    marginTop: "0.8em",
    marginBottom: "0.2em"
  }

  let artistStyle = {
    fontFamily: "Carme",
    marginTop: "0.3em",
    marginBottom: "0.1em"
  }

  let playerIconStyle = {
    marginTop: "0.4em"
  }

  let hearingIconStyle = {
    marginTop: "0.2em",
    fontSize: "2.3em"
  }

  let voteStyle = {
    fontFamily: "Roboto",
    position: "relative",
    bottom: "10%"
  }

  const iconStyle = {fontSize: '30px'};
  let artwork_url = currentSong && currentSong.artwork_url;
  let vote_priority = currentSong && currentSong.vote_priority;

  return (
    <div>
      <LinearProgress
        mode="determinate"
        style={progBarStyle}
      />
      <Row>
        <Col style={playerIconStyle} xsOffset={0} xs={2}>
          {artwork_url ? <img id="playerImgStyle" src={artwork_url} />  : <i className="zmdi zmdi-playlist-audio zmdi-hc-3x mdc-text-grey"></i>}
        </Col>

        <Col xs={5} style={songInfoColStyle}>
          <h2 style={titleStyle}>{currentSong && currentSong.title}</h2>
          <h3 style={artistStyle}>by: {currentSong && currentSong.artist } - {currentSong && currentSong.duration}</h3>
          <h4 style={artistStyle}>Chosen by: {ownSong ? 'YOU' : (currentSong && currentSong.dj_name)} </h4>
        </Col>

        <Col xs={5} style={playerIconStyle}>
          <Row>
            <Col xs={2}>
              <h2 style={voteStyle}>{vote_priority > 0 ? `+${vote_priority}` : vote_priority }</h2>
            </Col>

            <Col xsOffset={2} xs={2}>
              <IconButton disabled={(ownSong || !hasVotes)} iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={onWater} />
            </Col>

            <Col xsOffset={1} xs={1}>
              <IconButton disabled={(ownSong || !hasVotes)} iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-up zmdi-hc-3x" onTouchTap={onFire} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class GuestPlayer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
          snackbarOpen: false
        }

        this.onFire = this.onFire.bind(this);
        this.onWater = this.onWater.bind(this);

        this.openSnackbar = this.openSnackbar.bind(this);
        this.closeSnackbar = this.closeSnackbar.bind(this);

        // this.triggerFirebase = this.triggerFirebase.bind(this);
        // this.mapDurationSecsToMins = this.mapDurationSecsToMins.bind(this)

        // POSSIBLE TO TRIGGER ON PLAY/PAUSE?????
        // const { soundCloudAudio } = this.props;
        // soundCloudAudio.audio.addEventListener('ended', () => {
        //     console.log('SONG ENDED!!!');
        //     this.triggerFirebase();
        // });
    }

    onFire() {
      const { fireboss, currentSong, currentParty } = this.props;
      fireboss.onUpvote(currentParty.id, currentSong);
      this.openSnackbar();
    }

    onWater() {
      const { fireboss, currentSong, currentParty } = this.props;
      fireboss.onDownvote(currentParty.id, currentSong);
      this.openSnackbar();
    }

    openSnackbar() {
      this.setState({snackbarOpen: true});
    }

    closeSnackbar() {
      this.setState({snackbarOpen: false});
    }

    render() {
      let { currentSong, user, votes } = this.props;

      return (
        <div>
          <DumbGuestPlayer
            hasVotes={(votes > 0)}
            uid={user && user.uid}
            currentSong={ currentSong }
            onFire={ this.onFire }
            onWater={ this.onWater }
            />
          <Snackbar
            open={this.state.snackbarOpen}
            message={`You have ${votes} more votes before the next song`}
            autoHideDuration={1500}
            onRequestClose={this.closeSnackbar}
            contentStyle={{ fontSize: '0.7em' }}
            bodyStyle={{ height: '4em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            />
        </div>
      );
    }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentParty, currentSong, fireboss, user, votes }) => ({ currentParty, currentSong, fireboss, user, votes });

export default connect(mapStateToProps)(GuestPlayer);
