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
        super(props)
        this.play = this.play.bind(this);
        this.triggerFirebase = this.triggerFirebase.bind(this);
        const { soundCloudAudio, song_uri } = this.props;
        soundCloudAudio.audio.addEventListener('ended', () => {
            console.log('SONG ENDED!!!');
            this.triggerFirebase();
        });

        soundCloudAudio.audio.addEventListener('loaded', () => {
            console.log('the track', soundCloudAudio._track)

        });




        // this.props.firebase && this.props.firebase.database().ref('needSong').on('value', snapshot => {
        //     // setTimeout(() => {
        //     //     console.log('needSong just updated!', snapshot.val())
        //     //     if(!snapshot.val()) {
        //     //         this.play()
        //     //     }
        //     // }, 1000)
        //     console.log('shit changed')
        //     console.log(song_uri)

        //     console.log('in the if')
        //     soundCloudAudio.resolve('https://soundcloud.com/stepan-i-meduza-official/dolgo-obyasnyat', () => {
        //         console.log('resolved')
        //     })


        // })
    }

    componentWillReceiveProps() {
        console.log('uri in custom player', this.props.song_uri)
        if(this.props.song_uri) {
            this.props.soundCloudAudio.resolve(this.props.song_uri, () => {
                console.log('resolved with new props!')
                this.play()
            })
        }
    }


    play() {
        let { soundCloudAudio, playing } = this.props;
        if (playing) {
            soundCloudAudio.pause();
        } else {
            soundCloudAudio.play();
            console.log('the play function has actived "play"')
            console.log('what we are playing', soundCloudAudio._track)
            console.log(soundCloudAudio)
        }
    }

    triggerFirebase() {
        const { firebase } = this.props;
        firebase.database().ref('needSong').set(true);
    }

    render() {
        let { track, playing, soundCloudAudio, currentTime, duration } = this.props;
        if (!track) {
            return <div>Loading...</div>;
        }
        // console.log('rendering custom player')

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
        this.ready = this.ready.bind(this)
    }

    ready() {
        console.log('special onReady is ready')
    }
    render() {
        const { song_uri } = this.props.currentSong || 'https://soundcloud.com/stepan-i-meduza-official/dolgo-obyasnyat'
        // console.log('rendering CustomPlayerWrapper', song_uri)
        return (
            <SoundPlayerContainer
                resolveUrl={song_uri}
                clientId={clientId}>
                <CustomPlayer firebase={this.props.firebase} song_uri={song_uri}/>
            </SoundPlayerContainer>
        );
    }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ currentSong, firebase }) => ({ currentSong, firebase })

const CustomPlayerContainer = connect(mapStateToProps)(CustomPlayerWrapper)




export default CustomPlayerContainer
