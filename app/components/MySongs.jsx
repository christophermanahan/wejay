import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Audiotrack from 'material-ui/svg-icons/image/audiotrack';

/* -----------------    DUMB COMPONENTS     ------------------ */

const DumbSong = props => {
  const { title, artist, artwork_url } = props;
  console.log("TITLTLELELE", title)
  return (
    <ListItem
      primaryText={title}
      secondaryText={artist}
      leftAvatar={artwork_url ? <Avatar src={artwork_url}/> : <Avatar color={cyan500} backgroundColor='#363836' icon={<Audiotrack />}/>}
    />
  )
}

const DumbMySongs = props => {
  const { personalQueue } = props;
  console.log('PQPQPQPQPQ', personalQueue)
  let songArr = [];
  for (let song in personalQueue) { songArr.push(personalQueue[song]) };
  console.log('SONG ARRAY', songArr)
  return (
    <div>
      <List>
        { songArr.length && songArr.map((song, i) => {
          console.log("THIS IS A SONG", song)
          return 
            <DumbSong
              title={song.title}
              key={i}
              artwork_url={song.artwork_url}
              artist={song.artist}
            />
        })}
      </List>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class MySongs extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let { personalQueue } = this.props
    console.log('HERE', personalQueue)
  }

  render() {
    let { personalQueue } = this.props;
    console.log('rendering', personalQueue)
    return (
      <DumbMySongs personalQueue={personalQueue}/>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ personalQueue }) => ({ personalQueue });


export default connect(mapStateToProps)(MySongs);
