import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Audiotrack from 'material-ui/svg-icons/image/audiotrack';

/* -----------------    DUMB COMPONENTS     ------------------ */
const DumbSong = props => {
  const { title, artist, artwork_url } = props;
  return (
    <div>
      <ListItem
        primaryText={title}
        secondaryText={artist}
        leftAvatar={artwork_url ? <Avatar src={artwork_url}/> : <Avatar color={cyan500} backgroundColor='#363836' icon={<Audiotrack />}/>}
      />
    </div>
  );
};

const DumbMySongs = props => {
  const { personalQueue } = props;
  let songArr = [];
  for (let song in personalQueue) { songArr.push(personalQueue[song]) };
  return (
    <div>
      <List>
        { songArr && songArr.map((song, i) => (
          <DumbSong
            title={song.title}
            artist={song.artist}
            artwork_url={song.artwork_url}
          />
        ))}
      </List>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class MySongs extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let { personalQueue } = this.props;
    return (
      <DumbMySongs personalQueue={personalQueue}/>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ personalQueue }) => ({ personalQueue });


export default connect(mapStateToProps)(MySongs);
