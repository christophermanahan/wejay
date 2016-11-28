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

class CustomPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.play = this.play.bind(this);
        this.triggerFirebase = this.triggerFirebase.bind(this);
        this.mapDurationSecsToMins = this.mapDurationSecsToMins.bind(this)

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
    next() {
      console.log("YOU PRESSED NEXT SONG");
    }


    triggerFirebase() {
        const { firebase, partyId } = this.props;
        firebase.database().ref('parties').child(partyId).update({needSong: true})
    }

    mapDurationSecsToMins(num) {
      let mins = Math.floor(num / 60);
      let secs = num % 60;
      return `${mins}:${secs}`
    }







    render() {
        // console.log('props in custom player', this.props)
        let { track, playing, soundCloudAudio, currentTime, duration } = this.props;

        duration = Math.floor(duration)
        currentTime = Math.floor(currentTime)
        // console.log("BEFORE: ", duration);
        duration = this.mapDurationSecsToMins(duration)
        // console.log("After: ", duration);


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


        return (
            <div>

                <LinearProgress
                  mode="determinate"
                  value={(currentTime / duration) * 100 || 0 }
                  style={progBarStyle}
                  />

                <Row>
                <Col style={playerIconStyle} xsOffset={1} xs={2}>
                  {(track && !track.artwork_url) ? <i className="zmdi zmdi-playlist-audio zmdi-hc-3x mdc-text-grey"></i> : <img id="playerImgStyle" src={track.artwork_url} /> }
                </Col>
                <Col xs={5} style={songInfoColStyle}>

                  <p style={durationStyle}> {currentTime} / {duration}</p>
                  <h2 style={titleStyle}>{track.title}</h2>
                  <h3 style={artistStyle}>{track.user.username}</h3>

                </Col>

                <Col xs={2} style={playerIconStyle}>

                  <Row between="xs">
                    <Col xs={1}>
                      <IconButton
                        iconStyle={styles.largeIcon}
                        style={styles.buttonStyle}
                        onClick={this.play}>
                        {!playing ? <PlayCircleOutline /> : <PauseCircleOutline />}
                      </IconButton>
                    </Col>
                    <Col xs={1}>
                      <IconButton
                        iconStyle={styles.largeIcon}
                        style={styles.buttonStyle}
                        onClick={this.next}>
                        <NextSongButton />
                      </IconButton>
                    </Col>

                  </Row>

                </Col>

              </Row>

            </div>
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
                  firebase={this.props.firebase}
                  song_uri={song_uri}
                  partyId={this.props.currentParty.id}
                />
            </SoundPlayerContainer>
        );
    }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong, firebase, currentParty }) => ({ currentSong, firebase, currentParty })

const CustomPlayerContainer = connect(mapStateToProps)(CustomPlayerWrapper)




export default CustomPlayerContainer
