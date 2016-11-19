import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';
import { connect } from 'react-redux';

require('APP/.env.js');

// const config = {
//   id: process.env.SC_CLIENT_ID,
//   secret: process.env.SC_CLIENT_SECRET
// }

const clientId = process.env.SC_CLIENT_ID;

class CustomPlayer extends React.Component {
    play() {
        let { soundCloudAudio, playing } = this.props;
        if (playing) {
            soundCloudAudio.pause();
        } else {
            soundCloudAudio.play();
        }
    }

    render() {
        let { track, playing } = this.props;

        if (!track) {
            return <div>Loading...</div>;
        }

        return (
            <div>
                <h2>{track.title}</h2>
                <h3>{track.user.username}</h3>
                <button onClick={this.play.bind(this)}>
                    {playing ? 'Pause' : 'Play'}
                </button>
            </div>
        );
    }
}

class CustomPlayerWrapper extends React.Component {
    render() {
        const { song_uri } = this.props.currentSong || 'https://soundcloud.com/stepan-i-meduza-official/dolgo-obyasnyat'
        return (
            <SoundPlayerContainer resolveUrl={song_uri} clientId={clientId}>
                <CustomPlayer />
            </SoundPlayerContainer>
        );
    }
}

const mapStateToProps = ({ currentSong }) => ({ currentSong })

const CustomPlayerContainer = connect(mapStateToProps)(CustomPlayerWrapper)




export default CustomPlayerContainer
