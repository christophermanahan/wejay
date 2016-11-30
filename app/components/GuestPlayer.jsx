import React, {Component} from 'react';
import { connect } from 'react-redux';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import LinearProgress from 'material-ui/LinearProgress';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbGuestPlayer = props => {
  const { currentSong, onFire, onWater } = props;

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
          <h3 style={artistStyle}>by: {currentSong && currentSong.artist }</h3>
          <h4 style={artistStyle}>Chosen by: {currentSong && currentSong.dj_name} </h4>
        </Col>

        <Col xs={5} style={playerIconStyle}>
          <Row>
            <Col xs={2}>
              <h2 style={voteStyle}>{vote_priority > 0 ? `+${vote_priority}` : vote_priority }</h2>
            </Col>

            <Col xsOffset={2} xs={2}>
              <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={onWater} />
            </Col>

            <Col xsOffset={1} xs={1}>
              <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-fire zmdi-hc-3x" onTouchTap={onFire} />
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

        this.onFire = this.onFire.bind(this);
        this.onWater = this.onWater.bind(this);
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
      fireboss.incrementCurrSongDjPoints(currentSong.uid, currentParty.id);
    }

    onWater() {
      const { fireboss, currentSong, currentParty } = this.props;
      fireboss.decrementCurrSongDjPoints(currentSong.uid, currentParty.id);
    }

    render() {
        console.log('props in GUEST player', this.props)
        let { currentSong } = this.props
        console.log("CURRENT SONG: ", currentSong);
        // let { track, playing, currentTime, } = this.props;
        //
        // duration = Math.floor(duration)
        // currentTime = Math.floor(currentTime)
        // // console.log("BEFORE: ", duration);
        // duration = this.mapDurationSecsToMins(duration)
        // // console.log("After: ", duration);


        // if (!track) {
        //     return <div><i className="zmdi zmdi-soundcloud zmdi-hc-5x"></i></div>;
        // }

        return (
          <DumbGuestPlayer
            currentSong={ currentSong }
            onFire={ this.onFire }
            onWater={ this.onWater }
          />
        );
    }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentParty, currentSong, fireboss }) => ({ currentParty, currentSong, fireboss });

export default connect(mapStateToProps)(GuestPlayer);
