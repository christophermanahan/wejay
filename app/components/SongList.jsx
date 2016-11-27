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
    console.log(songId)
    console.log('fire swag')
  }

  onWater(songId) {
    console.log(songId)

    console.log('water swag')
  }

  render() {
  const { topTen } = this.props;
  let topTenArr = [];
  for (let song in topTen) {
    let topTenSong = Object.assign({}, topTen[song], {id: song})
    topTenArr.push([topTenSong.vote_priority, topTenSong])
    topTenArr.sort((a, b) => (b[0] - a[0]))
  }

  return (
    <div className="song-list-container">
      {topTenArr.length && topTenArr.map((song) => (
        song && <Song title={song[1].title}
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

const mapStateToProps = ({ firebase, topTen }) => ({ firebase, topTen });
const SongContainer = connect(mapStateToProps)(SongList);

export default SongContainer;
