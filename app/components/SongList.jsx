import React, {Component} from 'react';
import { connect } from 'react-redux';
import Song from './Song';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import {List, ListItem} from 'material-ui/List';



/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSongList = props => {

  const { topTenArr, netHeat, calcHeatIndex, onFire, onWater } = props;
  return (
    <Row className="app-no-margin song-list-container">
      {topTenArr && topTenArr.map((song, index) => (
        song && <Song title={song.title}
                      rank={index + 1}
                      artist={song.artist}
                      DJ={song.DJ}
                      onFire={onFire}
                      onWater={onWater}
                      id={song.id}
                      key={song.id}
                      heatIndex={calcHeatIndex(song, netHeat)}
                />
      ))}
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
    return songHeat / netHeat;
  }

  render() {
    const { topTen } = this.props;

    let topTenArr = [];
    for (let song in topTen) {
      let topTenSong = Object.assign({}, topTen[song], {id: song});
      topTenArr.push(topTenSong);
    }
    topTenArr.sort((a, b) => ((+b.vote_priority + +b.time_priority) - (+a.vote_priority + +a.time_priority)));

    const netHeat = this.calcNetHeat(topTenArr);

    return (
      <DumbSongList
        topTenArr={ topTenArr }
        calcHeatIndex={ this.calcHeatIndex }
        netHeat={ netHeat }
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
