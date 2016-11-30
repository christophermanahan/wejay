import React, {Component} from 'react';
import { connect } from 'react-redux';

import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';

import Audiotrack from 'material-ui/svg-icons/image/audiotrack';

import {cyan500} from 'material-ui/styles/colors';
import { Row, Col } from 'react-flexbox-grid/lib/index';


/* -----------------    DUMB COMPONENTS     ------------------ */
const DumbSong = props => {
  const { title, artist, artwork_url, heat } = props;
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
  const { personalQueue, shadowQueue, topTen, uid } = props;
  let pQArr = [];
  for (let song in personalQueue) { pQArr.push(personalQueue[song]) }

  let sQArr = [];
  for (let song in shadowQueue) { sQArr.push(shadowQueue[song]) }

  let topTenArr = [];
  for (let song in topTen) {
    if (topTen[song].uid === uid) {
      topTenArr.push(topTen[song]);
    }
  }


  return (
    <Row>
      <Col xs={12}>
      { pQArr && pQArr.length && sQArr && sQArr.length && topTenArr && topTenArr.length ?
        <List>
          {
            topTenArr.length ?
            <h4 className="mysongs-divider">In the Top Ten!</h4>
            :
            ''
          }
          {
            topTenArr.length &&
              topTenArr.map((song, i) => (
                <DumbSong
                  title={song.title}
                  artist={song.artist}
                  artwork_url={song.artwork_url}
                  key={i}
                  heat={song.vote_priority}
                />
              ))
          }
          {
            sQArr.length ?
            <div>
              <Divider />
              <h4 className="mysongs-divider mysongs-divider-mid">My Suggestions</h4>
            </div>
            :
            ''
          }
          {
            sQArr.length &&
              sQArr.map((song, i) => (
                <DumbSong
                  title={song.title}
                  artist={song.artist}
                  artwork_url={song.artwork_url}
                  key={i}
                />
              ))
          }
          {
            pQArr.length ?
              <div>
                <Divider />
                <h4 className="mysongs-divider mysongs-divider-mid">For Later...</h4>
              </div>
              :
              ''
          }
          {
            pQArr.length &&
              pQArr.map((song, i) => (
                <DumbSong
                  title={song.title}
                  artist={song.artist}
                  artwork_url={song.artwork_url}
                  key={i}
                />
              ))
          }
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
    let { personalQueue, shadowQueue, topTen, uid } = this.props;
    return (
      <DumbMySongs
        personalQueue={personalQueue}
        shadowQueue={shadowQueue}
        topTen={topTen}
        uid={uid}
      />
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ personalQueue, shadowQueue, topTen, user }) => ({ personalQueue, shadowQueue, topTen, uid: user.uid });


export default connect(mapStateToProps)(MySongs);
