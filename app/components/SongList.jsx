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
  for (let song in topTen) {
    let topTenSong = Object.assign({}, topTen[song], {id: song})
    topTenArr.push([topTenSong.vote_priority, topTenSong])
    topTenArr.sort((a, b) => (b[0] - a[0]))
  }
  let rank = 1
  return (
    <div className="song-list-container">
      {topTenArr.length && topTenArr.map((song) => (
        song && <Song title={song[1].title}
                      rank={rank++}
                      artist={song[1].artist}
                      DJ={song[1].DJ}
                      onFire={this.onFire}
                      onWater={this.onWater}
                      id={song[1].id}
                      key={song[1].id}
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
