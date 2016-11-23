import React, {Component} from 'react';
import { connect } from 'react-redux';
import Song from './Song';

/* -----------------    DUMB COMPONENT     ------------------ */

const SongList = props => {
  const { topTen } = props;
  let topTenArr = [];
  for (let song in topTen) {
    topTenArr.push(topTen[song]);
  }
  return (
    <div className="song-list-container">
      {topTenArr.length && topTenArr.map((song, index) => (
        song && <Song title={song.title}
                      artist={song.artist}
                      DJ={song.DJ}
                      key={index}
                />
      ))}
    </div>
  )
}

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ topTen }) => ({topTen});
const SongContainer = connect(mapStateToProps)(SongList);

export default SongContainer;
