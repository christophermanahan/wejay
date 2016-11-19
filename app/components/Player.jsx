import React from 'react';
import { SoundPlayerContainer } from 'react-soundplayer/addons';

require('APP/.env.js');

// const config = {
//   id: process.env.SC_CLIENT_ID,
//   secret: process.env.SC_CLIENT_SECRET
// }

const clientId = process.env.SC_CLIENT_ID;
const resolveUrl = 'https://soundcloud.com/stepan-i-meduza-official/dolgo-obyasnyat';

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

class App extends React.Component {
    render() {
        return (
            <SoundPlayerContainer resolveUrl={resolveUrl} clientId={clientId}>
                <CustomPlayer />
            </SoundPlayerContainer>
        );
    }
}

export default App

// import React, {Component} from 'react';
//
// import { PlayButton, Progress, Icons, Timer } from 'react-soundplayer/components';
// import { SoundPlayerContainer } from 'react-soundplayer/addons';
//
//
// /* -----------------    STATEFUL REACT COMPONENT     ------------------ */
//
// class Player extends Component {
//   constructor(props) {
//     super(props);
//
//   }
//
//   render() {
//
//     return (
//         <div>
//           <h1>I will be the player yo</h1>
//             <PlayButton
//               className={String}
//               playing={Boolean}
//               seeking={Boolean}
//               seekingIcon={ReactElement}
//               onTogglePlay={Function}
//               soundCloudAudio={instanceof SoundCloudAudio}
//             />
//         </div>
//     );
//   }
// }
//
// export default Player
