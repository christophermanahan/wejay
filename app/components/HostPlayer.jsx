import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import PlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import PauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';
import NextSongButton from 'material-ui/svg-icons/av/skip-next';
// import PlaylistAudioImg from 'material-ui/svg-icons/av/playlist-audio';


import { Row, Col } from 'react-flexbox-grid/lib/index';

import publicKeys from '../utils/publicKeys'

import { connect } from 'react-redux';

const clientId = publicKeys.SC_CLIENT_ID;

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbCustomPlayer = props => {
  // console.log('props in custom player', this.props)
  let { track, playing, soundCloudAudio, currentTime, duration, onFire, onWater, mapDurationSecsToMins, play, triggerFirebase } = props;

  let dur = duration && Math.floor(duration)
  console.log(duration)
  let curTime = Math.floor(currentTime)
  let displayDuration = mapDurationSecsToMins(dur)



  if (!track) {
      return <div><i className="zmdi zmdi-soundcloud zmdi-hc-5x"></i></div>;
  }

  let progBarStyle = {
    backgroundColor: "#EC4616",
    height: ".3em"
  }
  let songInfoColStyle = {
    fontFamily: "Roboto",
    fontSize: "0.5em"
  }
  let durationStyle = {
    fontFamily: "Roboto",
    marginTop: "0.8em",
    marginBottom: "0.1em"
  }
  let titleStyle = {
    fontFamily: "Carme",
    marginTop: "0em",
    marginBottom: "0.1em"
  }
  let artistStyle = {
    fontFamily: "Carme",
    marginTop: "0.3em",
    marginBottom: "0.1em"
  }
  let playerIconStyle = {
    marginTop: "0.4em"
  }
  const styles = {
    largeIcon: {
      width: 35,
      height: 35,
    },
    buttonStyle: {
      width: 50,
      height: 50,
      padding: 5,
    },
  };
  const iconStyle = {fontSize: '30px'};

  return (
    <div>

      <LinearProgress
        mode="determinate"
        value={(curTime / dur) * 100 || 0 }
        style={progBarStyle}
      />

      <Row>
        <Col style={playerIconStyle} xs={2}>
          {(track && !track.artwork_url) ? <i className="zmdi zmdi-playlist-audio zmdi-hc-3x mdc-text-grey"></i> : <img id="playerImgStyle" src={track.artwork_url} /> }
        </Col>
        <Col xs={5} style={songInfoColStyle}>

          <p style={durationStyle}> {mapDurationSecsToMins(curTime)} / {displayDuration}</p>
          <h2 style={titleStyle}>{track.title}</h2>
          <h3 style={artistStyle}>{track.user.username}</h3>

        </Col>

        <Col xs={4} style={playerIconStyle}>

          <Row between="xs">
            <Col xs={1}>
              <IconButton
                iconStyle={styles.largeIcon}
                style={styles.buttonStyle}
                onClick={play}>
                {!playing ? <PlayCircleOutline /> : <PauseCircleOutline />}
              </IconButton>
            </Col>

            <Col xs={1}>
              <IconButton
                iconStyle={styles.largeIcon}
                style={styles.buttonStyle}
                onClick={triggerFirebase}>
                <NextSongButton />
              </IconButton>
            </Col>

            <Col xs={1}>
              <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-down zmdi-hc-3x" onTouchTap={onWater}/>
            </Col>

            <Col xs={1}>
              <IconButton iconStyle={iconStyle} iconClassName="zmdi zmdi-thumb-up zmdi-hc-3x" onTouchTap={onFire} />
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class CustomPlayer extends React.Component {
  constructor(props) {
      super(props);
      this.play = this.play.bind(this);
      this.triggerFirebase = this.triggerFirebase.bind(this);
      this.mapDurationSecsToMins = this.mapDurationSecsToMins.bind(this);
      this.onFire = this.onFire.bind(this);
      this.onWater = this.onWater.bind(this);
      // soundCloudAudio prop is automagically given to us by SoundPlayerContainer
      const { soundCloudAudio } = this.props;
      soundCloudAudio.audio.addEventListener('ended', () => {
          console.log('SONG ENDED!!!');
          this.triggerFirebase();
      });
  }

  componentWillReceiveProps(nextProps) {
      // trigger play only after current song has been updated and the audio object
      // has been received from SoundCloud
      if (this.props.song_uri && (nextProps.song_uri !== this.props.song_uri)) {
          console.log('-------- there is a new song -----------')
          this.props.soundCloudAudio.resolve(nextProps.song_uri, () => {
              this.play()
          })
      }
      // EDGE CASE: this fails to autoplay if the same song is played 2x in a row
      // SOLUTION: every song on top ten needs to have unique id
  }


  //Todo-->FIX: Custom Player renders before track loads



  play() {
      let { soundCloudAudio, playing } = this.props;
      if (playing) {
          soundCloudAudio.pause();
      } else {
          soundCloudAudio.play();
      }
  }


  triggerFirebase() {
      const { fireboss, partyId } = this.props;
      // fireboss.database().ref('parties').child(partyId).update({needSong: true})
      fireboss.triggerNeedSong(partyId)
  }

  mapDurationSecsToMins(num) {
    let mins = Math.floor(num / 60);
    let secs = num % 60;

    if(secs <= 9){
      return `${mins}:0${secs}`
    } else {
      return `${mins}:${secs}`
    }
  }

  onFire() {
    const { fireboss, currentSong, currentParty } = this.props;
    fireboss.incrementCurrSongDjPoints(currentSong.uid, currentParty.id);
  }

  onWater() {
    const { fireboss, currentSong, currentParty } = this.props;
    console.log(fireboss)
    fireboss.decrementCurrSongDjPoints(currentSong.uid, currentParty.id);
  }

  render() {
    const { track, playing, soundCloudAudio, currentTime, duration } = this.props;
    return (
      <DumbCustomPlayer
        track={track}
        playing={playing}
        soundCloudAudio={soundCloudAudio}
        currentTime={currentTime}
        duration={duration}
        onFire={this.onFire}
        onWater={this.onWater}
        mapDurationSecsToMins={this.mapDurationSecsToMins}
        play={this.play}
        triggerFirebase={this.triggerFirebase}
      />
    );
  }
}
/* -----------------    CUSTOM WRAPPER COMPONENT     ------------------ */


class CustomPlayerWrapper extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        let song_uri
        if (this.props.currentSong) { song_uri = this.props.currentSong.song_uri}

        return (
            <SoundPlayerContainer
                resolveUrl={song_uri}
                clientId={clientId}>
                <CustomPlayer
                  fireboss={this.props.fireboss}
                  song_uri={song_uri}
                  partyId={this.props.currentParty.id}
                  currentSong={this.props.currentSong}
                  currentParty={this.props.currentParty}
                />
            </SoundPlayerContainer>
        );
    }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong, currentParty, fireboss }) => ({ currentSong, currentParty, fireboss })

const CustomPlayerContainer = connect(mapStateToProps)(CustomPlayerWrapper)




export default CustomPlayerContainer
