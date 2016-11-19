import React, {Component} from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import Song from './Song'

/* -----------------    DUMB COMPONENT     ------------------ */

const SongList = props => {
  const { topTen } = props;
  let topTenArr = [];
  for(let song in topTen) {
    topTenArr.push(topTen[song])
  }
  return (
    <div>
      {topTenArr.length && topTenArr.map(song => (
        song && <Song title={song.title} artist={song.artist} DJ={song.DJ} key={song.sc_id} />
      ))}
    </div>
  )
}

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ topTen }) => ({topTen});
const mapDispatchToProps = dispatch => ({});
const SongContainer = connect(mapStateToProps, mapDispatchToProps)(SongList);

export default SongContainer;
