import React, {Component} from 'react';
import { connect } from 'react-redux';
import {RaisedButton, TextField} from 'material-ui';
import {fetchTrackResults} from '../ducks/searchResults';
import Fireboss from '../utils/fireboss'

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
    const fireboss = new Fireboss(firebase)
    const partyId = currentParty.id
    const { uid } = user;
    const dj_name = `DJ ${user.displayName || 'Anon'}`
    const song = { song_uri, title, artist, dj_name, uid, time_priority: 0, vote_priority: 0};

    const gettingCurrentSong = fireboss.gettingPartyItemSnapshot(partyId, 'current_song')
    const gettingTopTen = fireboss.gettingPartyItemSnapshot(partyId, 'top_ten')
    const gettingShadowQueue = fireboss.gettingPartyItemSnapshot(partyId, 'shadow_queue')

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
        fireboss.setCurrentSong(partyId, song)
      } else if (!topTenVal || Object.keys(topTenVal).length < 10) {
        fireboss.addToPartyQueue(partyId, 'top_ten', song)
      } else if (!shadowQueueVal || !userSongInShadowQueue) {
        fireboss.addToPartyQueue(partyId, 'shadow_queue', song)
      } else {
        fireboss.addToPersonalQueue(partyId, user, song)
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
