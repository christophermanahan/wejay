import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';

import Audiotrack from 'material-ui/svg-icons/image/audiotrack';

import {cyan500} from 'material-ui/styles/colors';
import { Row, Col } from 'react-flexbox-grid/lib/index';


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
  for (let song in personalQueue) { songArr.push(personalQueue[song]) }

  return (
    <Row>
      <Col xs={12}>
      { songArr && songArr.length ?
        <List>
        { songArr && songArr.map((song, i) => (
          <DumbSong
            title={song.title}
            artist={song.artist}
            artwork_url={song.artwork_url}
            key={i}
          />
        ))}
        </List>
        :
        <Row>
          <Col xs={6} xsOffset={3}>
            <h4 id="mysongs-fail">You have no songs queued!</h4>
          </Col>
          <Col xs={12} className="mysongs-col">
            <FontIcon style={{ fontSize: '120px' }}
                      className="zmdi zmdi-mood-bad zmdi-hc-4x"
                      color={cyan500}
            />
          </Col>
        </Row>
      }
      </Col>
    </Row>
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
