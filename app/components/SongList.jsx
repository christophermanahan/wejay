import React, {Component} from 'react';
import { connect } from 'react-redux';
import Song from './Song';

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */
class SongList extends Component {
  constructor(props) {
    super(props);
    this.onFire = this.onFire.bind(this)
    this.onWater = this.onWater.bind(this)
  }


  onFire(songId) {
    const { fireboss, currentParty } = this.props
    fireboss.incrementVotePriority(currentParty.id, songId)
  }

  onWater(songId) {
    const { fireboss, currentParty } = this.props
    fireboss.decrementVotePriority(currentParty.id, songId)
  }

  render() {
  const { topTen } = this.props;
  let topTenArr = [];
  let rank = 1

  for (let song in topTen) {
    let topTenSong = Object.assign({}, topTen[song], {id: song})
    topTenArr.push(topTenSong)
  }

  topTenArr.sort((a, b) => (b.vote_priority - a.vote_priority))
  return (
    <div className="song-list-container">
      {topTenArr.length && topTenArr.map((song) => (
        song && <Song title={song.title}
                      rank={rank++}
                      artist={song.artist}
                      DJ={song.DJ}
                      onFire={this.onFire}
                      onWater={this.onWater}
                      id={song.id}
                      key={song.id}
                />
      ))}
    </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ fireboss, currentParty, topTen }) => ({ fireboss, currentParty, topTen });
const SongContainer = connect(mapStateToProps)(SongList);

export default SongContainer;
