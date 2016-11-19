import React, {Component} from 'react';
import { connect } from 'react-redux';


import {RaisedButton, TextField} from 'material-ui';

import {fetchTrackResults} from '../ducks/searchResults';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

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
    const { displayName } = this.props.user
    const DJ = displayName ? `DJ ${displayName}` : 'DJ anon'
    const song = { song_uri, title, sc_id, artist, DJ };
    // send to firebase
    this.props.firebase.database().ref().child('top_ten').push(song);

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

const mapStateToProps = ({ searchResults, firebase, user }) => ({ searchResults, firebase, user });
const mapDispatchToProps = dispatch => ({
  tracksearch: (query) => dispatch(fetchTrackResults(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
