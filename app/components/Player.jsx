import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import LinearProgress from 'material-ui/LinearProgress';
import IconButton from 'material-ui/IconButton';
import PlayCircleOutline from 'material-ui/svg-icons/av/play-circle-outline';
import PauseCircleOutline from 'material-ui/svg-icons/av/pause-circle-outline';

import { connect } from 'react-redux';

require('APP/.env.js');
const clientId = process.env.SC_CLIENT_ID;


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
        const { firebase } = this.props;
        firebase.database().ref('needSong').set(true);
    }

    render() {
        console.log('props in custom player', this.props)
        let { track, playing, soundCloudAudio, currentTime, duration } = this.props;
        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h2>{track.title}</h2>
                <h3>{track.user.username}</h3>
                <IconButton
                    onClick={this.play}>
                    {!playing ? <PlayCircleOutline /> : <PauseCircleOutline />}
                </IconButton>
                <LinearProgress
                    mode="determinate"
                    value={(currentTime / duration) * 100 || 0 }
                />
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
                <CustomPlayer firebase={this.props.firebase} song_uri={song_uri} />
            </SoundPlayerContainer>
        );
    }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong, firebase }) => ({ currentSong, firebase })

const CustomPlayerContainer = connect(mapStateToProps)(CustomPlayerWrapper)




export default CustomPlayerContainer
