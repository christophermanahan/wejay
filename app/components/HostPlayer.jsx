import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import PlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import PauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';
import PrevSongButton from 'material-ui/svg-icons/av/skip-previous';
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
    prev(){
      console.log("YOU PRESSED PREVIOUS SONG");
    }

    triggerFirebase() {
        const { firebase, partyId } = this.props;
        firebase.database().ref('parties').child(partyId).update({needSong: true})
    }

    render() {
        console.log('props in custom player', this.props)
        let { track, playing, soundCloudAudio, currentTime, duration } = this.props;
        if (!track) {
            return <div id="loading-player"><i className="zmdi zmdi-soundcloud"></i></div>;


        }
        console.log("TRACK: ", track);

        let progBarStyle = {
          backgroundColor: "#EC4616",
          height: "8px"
        }

        //Todo-->FIX: Custom Player renders before track loads



        return (
            <div id="host-player">

                <LinearProgress
                  mode="determinate"
                  value={(currentTime / duration) * 100 || 0 }
                  style={progBarStyle}
                  />

                <Row>
                  {(!track.artwork_url) ? <i class="zmdi zmdi-playlist-audio"></i> : <img src={track.artwork_url} /> }
                <Col xsOffset={1} xs={6}>
                  <Row>
                    <p> {Math.floor(currentTime)} / {Math.floor(duration)}</p>
                  </Row>

                  <h2>{track.title}</h2>
                  <h3>{track.user.username}</h3>

                </Col>


                <Col xsOffset={9} xs={2}>

                  <Row id="player-buttons">
                    <IconButton
                      onClick={this.prev}>
                      <PrevSongButton />
                    </IconButton>
                    <IconButton
                      onClick={this.play}>
                      {!playing ? <PlayCircleOutline /> : <PauseCircleOutline />}
                    </IconButton>
                    <IconButton
                      onClick={this.next}>
                      <NextSongButton />
                    </IconButton>

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
