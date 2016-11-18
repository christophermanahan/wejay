import React, {Component} from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import Song from './Song'

/* -----------------    DUMB COMPONENT     ------------------ */

const SongList = props => {
  const { topTen } = props;
  return (
    <div>
      {topTen && topTen.map(song => (
        song && <Song name={song.name} artist={song.artist} DJ={song.DJ} key={song.sc_id} />
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