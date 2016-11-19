import React, {Component} from 'react';
import { connect } from 'react-redux';


import {RaisedButton, TextField} from 'material-ui';

import {fetchTrackResults} from '../ducks/searchResults';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import SearchResults from './SearchResults';
import { appendToTopTen } from '../ducks/topTen';

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
    this.addToQuery = this.addToQuery.bind(this);
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

  addToQuery(song_uri, title, sc_id) {
    const { appendtotopten } = this.props;
    console.log('added something to playlist!', song_uri, title, sc_id);
    const song = { song_uri, title, sc_id };
    appendtotopten(song);

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
            addToQuery={ this.addToQuery }
          />
        </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ searchResults }) => ({ searchResults });
const mapDispatchToProps = dispatch => ({
  tracksearch: (query) => dispatch(fetchTrackResults(query)),
  appendtotopten: song => dispatch(appendToTopTen(song))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
