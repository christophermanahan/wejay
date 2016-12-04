import React, {Component} from 'react';
import { connect } from 'react-redux';
import Song from './Song';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import {List, ListItem} from 'material-ui/List';
import {cyan500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';

import Snackbar from 'material-ui/Snackbar';




/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSongList = props => {

  const { topTenArr, calcNetHeat, calcHeatIndex, onFire, onWater, uid, hasVotes } = props;
  const netHeat = calcNetHeat(topTenArr);
  return (
    <Row className="app-no-margin song-list-container">
      {
        topTenArr && topTenArr.length ?
          topTenArr && topTenArr.map((song, index) => (
          song && <Song title={song.title}
                        rank={index + 1}
                        artist={song.artist}
                        dj_name={song.dj_name}
                        onFire={onFire}
                        onWater={onWater}
                        id={song.id}
                        key={song.id}
                        heatIndex={calcHeatIndex(song, netHeat)}
                        ownSong={(uid === song.uid)}
                        hasVotes={hasVotes}
                  />
          ))
        :
        <Col xs={12}>
          <Row>
            <Col xs={6} xsOffset={3}>
              <h4 className="songlist-fail">Add some songs!</h4>
              <h4 className="songlist-fail">Vote for songs you like!</h4>
              <h4 className="songlist-fail">Earn DJ points!</h4>

            </Col>
            <Col xs={12} className="mysongs-col">
              <FontIcon style={{ fontSize: '120px' }}
                        className="zmdi zmdi-mood zmdi-hc-4x"
                        color={cyan500}
              />
            </Col>
          </Row>
        </Col>
      }
    </Row>
  );
};


/* -----------------    STATEFUL REACT COMPONENT     ------------------ */
class SongList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      snackbarOpen: false
    }

    this.onFire = this.onFire.bind(this);
    this.onWater = this.onWater.bind(this);
    this.calcHeatIndex = this.calcHeatIndex.bind(this);
    this.calcNetHeat = this.calcNetHeat.bind(this);

    this.openSnackbar = this.openSnackbar.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);

  }


  onFire(songId) {
    const { fireboss, currentParty } = this.props;
    fireboss.incrementVotePriority(currentParty.id, songId);
    this.openSnackbar();
  }

  onWater(songId) {
    const { fireboss, currentParty } = this.props;
    fireboss.decrementVotePriority(currentParty.id, songId);
    this.openSnackbar();
  }

  openSnackbar() {
    this.setState({snackbarOpen: true});
  }

  closeSnackbar() {
    this.setState({snackbarOpen: false})
  }


  calcNetHeat(songsArr) {
    return songsArr.map(song => song.vote_priority + song.time_priority)
                   .reduce((a, b) => a + b, 0);
  }

  calcHeatIndex(song, netHeat) {
    const songHeat = +song.vote_priority + +song.time_priority;
    const absSongHeat = Math.abs(songHeat / netHeat);
    // return val is > 0 when net priority is positive, and vice-versa
    return (songHeat > 0) ? absSongHeat : absSongHeat * -1;
  }

  render() {
    const { topTen, user, votes } = this.props;

    let topTenArr = [];
    for (let song in topTen) {
      let topTenSong = Object.assign({}, topTen[song], {id: song});
      topTenArr.push(topTenSong);
    }
    topTenArr.sort((a, b) => ((+b.vote_priority + +b.time_priority) - (+a.vote_priority + +a.time_priority)));

    return (
      <div>
        <DumbSongList
          hasVotes={(votes > 0)}
          uid={user.uid}
          topTenArr={ topTenArr }
          calcHeatIndex={ this.calcHeatIndex }
          calcNetHeat={ this.calcNetHeat }
          onFire={ this.onFire }
          onWater={ this.onWater }
          />
        <Snackbar
          open={this.state.snackbarOpen}
          message={`You have ${votes} more votes before the next song`}
          autoHideDuration={1500}
          onRequestClose={this.closeSnackbar}
          contentStyle={{ fontSize: '0.7em' }}
          bodyStyle={{ height: '4em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          />
      </div>
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ user, fireboss, currentParty, topTen, votes }) => ({ user, fireboss, currentParty, topTen, votes });


const SongContainer = connect(mapStateToProps)(SongList);

export default SongContainer;
