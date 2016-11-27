import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import PlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import PauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';
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

    triggerFirebase() {
        const { firebase, partyId } = this.props;
        firebase.database().ref('parties').child(partyId).update({needSong: true})
    }

    render() {
        console.log('props in custom player', this.props)
        let { track, playing, soundCloudAudio, currentTime, duration } = this.props;
        if (!track) {
            return <div>Loading...</div>;
        }

        //Todo-->FIX: Custom Player renders before track loads

        return (
            <div>
              <LinearProgress
                  mode="determinate"
                  value={(currentTime / duration) * 100 || 0 }
              />

                <h2 id="host-track-title">{track.title}</h2>
                <h3 id="host-track-user">{track.user.username}</h3>
                  <p>currentTime: {currentTime}</p>
                  <p>duration: {duration}</p>
                <IconButton
                    onClick={this.play}>
                    {!playing ? <PlayCircleOutline /> : <PauseCircleOutline />}
                </IconButton>

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
