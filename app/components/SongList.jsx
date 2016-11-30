import React, {Component} from 'react';
import { connect } from 'react-redux';
import Song from './Song';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import {List, ListItem} from 'material-ui/List';
import {cyan500} from 'material-ui/styles/colors';
import FontIcon from 'material-ui/FontIcon';




/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSongList = props => {

  const { topTenArr, calcNetHeat, calcHeatIndex, onFire, onWater } = props;
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

    this.onFire = this.onFire.bind(this);
    this.onWater = this.onWater.bind(this);
    this.calcHeatIndex = this.calcHeatIndex.bind(this);
    this.calcNetHeat = this.calcNetHeat.bind(this);

  }


  onFire(songId) {
    const { fireboss, currentParty } = this.props;
    fireboss.incrementVotePriority(currentParty.id, songId);
  }

  onWater(songId) {
    const { fireboss, currentParty } = this.props;
    fireboss.decrementVotePriority(currentParty.id, songId);
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
    const { topTen } = this.props;

    let topTenArr = [];
    for (let song in topTen) {
      let topTenSong = Object.assign({}, topTen[song], {id: song});
      topTenArr.push(topTenSong);
    }
    topTenArr.sort((a, b) => ((+b.vote_priority + +b.time_priority) - (+a.vote_priority + +a.time_priority)));

    return (
      <DumbSongList
        topTenArr={ topTenArr }
        calcHeatIndex={ this.calcHeatIndex }
        calcNetHeat={ this.calcNetHeat }
        onFire={ this.onFire }
        onWater={ this.onWater }
      />
    );
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ fireboss, currentParty, topTen }) => ({ fireboss, currentParty, topTen });
const SongContainer = connect(mapStateToProps)(SongList);

export default SongContainer;
