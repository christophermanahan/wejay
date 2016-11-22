import React, {Component} from 'react';
import { connect } from 'react-redux';


import {RaisedButton, TextField} from 'material-ui';

import {fetchTrackResults} from '../ducks/searchResults';


import SearchResults from './SearchResults';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSearch = props => {
  const { onType, trackSearch } = props;
  return (
    <div>
      <form onSubmit={ trackSearch }>
        <TextField
          onChange={ onType }
          floatingLabelText="Search By Track"
        />
         <RaisedButton label="Search" onTouchTap={ trackSearch }/>
       </form>
    </div>
  );
};



/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    }

    this.onType = this.onType.bind(this);
    this.trackSearch = this.trackSearch.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
  }

  onType(evt) {
    evt.preventDefault();
    let query = evt.target.value;
    this.setState({ query });
  }


  trackSearch(evt){
    evt.preventDefault();
    const {tracksearch} = this.props;
    const {query} = this.state;
    if (!query.length) return;
    tracksearch(query);
  }

  addToQueue(song_uri, title, sc_id, artist) {
    console.log('added something to playlist!', song_uri, title, sc_id);
    const { user, currentParty, firebase } = this.props; 
    const { uid } = user;
    const DJ = 'DJ anon'
    const song = { song_uri, title, sc_id, artist, DJ, uid};
    // send to firebase
    const currentSong = firebase.database().ref('current_song').child(currentParty.id);
    const topTen = firebase.database().ref('top_ten').child(currentParty.id);
    const shadowQueue = firebase.database().ref('shadow_queue').child(currentParty.id);
    const personalQueue = firebase.database().ref('party_djs').child(currentParty.id).child(uid);

    const gettingCurrentSong = currentSong.once('value');
    const gettingTopTen = topTen.once('value');
    const gettingShadowQueue = shadowQueue.once('value');

    Promise.all([gettingCurrentSong, gettingTopTen, gettingShadowQueue])
    .then(results => {
      const currentSongVal = results[0] && results[0].val();
      const topTenVal = results[1] && results[1].val();
      const shadowQueueVal = results[2] && results[2].val();

      let userSongInShadowQueue = false; 

      if (shadowQueueVal) {
        for (let track in shadowQueueVal) {
          if (uid === shadowQueueVal[track].uid) userSongInShadowQueue = true;
        }
      }

      if(!currentSongVal) {
        currentSong.set(song);
      } else if (!topTenVal || Object.keys(topTenVal).length < 10) {
        topTen.push(song);
      } else if (!shadowQueueVal || !userSongInShadowQueue) {
        shadowQueue.push(song);
      } else {
        personalQueue.child('personal_queue').push(song);
      }
    });
  }

  render() {
    const { searchResults } = this.props
    return (
        <div>
          <DumbSearch
            onType={ this.onType }
            trackSearch={ this.trackSearch }
          />
          <SearchResults
            searchResults={ searchResults }
            addToQueue={ this.addToQueue }
          />
        </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ searchResults, firebase, user, currentParty }) => ({ searchResults, firebase, user, currentParty });
const mapDispatchToProps = dispatch => ({
  tracksearch: (query) => dispatch(fetchTrackResults(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
