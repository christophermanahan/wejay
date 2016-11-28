import React, {Component} from 'react';
import { connect } from 'react-redux';
import {RaisedButton, TextField} from 'material-ui';
import {fetchTrackResults} from '../ducks/searchResults';

import SearchResults from './SearchResults';

import { Row, Col } from 'react-flexbox-grid/lib/index';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSearch = props => {
  const { onType, trackSearch } = props;
  return (
    <div>
      <Row>
        <Col xs={12}>
          <form onSubmit={ trackSearch }>
          <Row>
            <Col xs={12}>
              <TextField
                onChange={ onType }
                floatingLabelText="Search By Track"
              />
            </Col>
          </Row>
          <Row>
             <Col xs={5} xsOffset={7}>
               <RaisedButton label="Search" onTouchTap={ trackSearch }/>
             </Col>
          </Row>
           </form>
        </Col>
      </Row>
    </div>
  );
};


/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: ''
    };

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

  addToQueue(song_uri, title, artist, artwork_url) {
    const { user, currentParty, fireboss } = this.props;
    const partyId = currentParty.id;
    const { uid } = user;
    const { dj_name } = this.props.djs[uid];
    const song = { song_uri, title, artist, artwork_url, uid, dj_name, time_priority: 0, vote_priority: 0};

    const gettingCurrentSong = fireboss.gettingPartyItemSnapshot(partyId, 'current_song');
    const gettingTopTen = fireboss.gettingPartyItemSnapshot(partyId, 'top_ten')
    const gettingShadowQueue = fireboss.gettingPartyItemSnapshot(partyId, 'shadow_queue');

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

      if (!currentSongVal) {
        fireboss.setCurrentSong(partyId, song);
        console.log(`added ${title} to Current Song!`)
      } else if (!topTenVal || Object.keys(topTenVal).length < 10) {
        fireboss.addToPartyQueue(partyId, 'top_ten', song);
        console.log(`added ${title} to Top Ten!`)
      } else if (!shadowQueueVal || !userSongInShadowQueue) {
        fireboss.addToPartyQueue(partyId, 'shadow_queue', song);
        console.log(`added ${title} to Suggestions!`)
      } else {
        fireboss.addToPersonalQueue(partyId, user, song);
        console.log(`added ${title} to My Songs!`)
      }
    });
  }

  render() {
    const { searchResults } = this.props;
    return (
        <div>
          <Row>
            <Col xs={8} xsOffset={2}>
              <DumbSearch
                onType={ this.onType }
                trackSearch={ this.trackSearch }
              />
            </Col>
            <Col xs={12}>
              <SearchResults
                searchResults={ searchResults }
                addToQueue={ this.addToQueue }
              />
            </Col>
          </Row>
        </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ searchResults, fireboss, user, currentParty, djs }) => ({ searchResults, fireboss, user, currentParty, djs });
const mapDispatchToProps = dispatch => ({
  tracksearch: (query) => dispatch(fetchTrackResults(query))
});

export default connect(mapStateToProps, mapDispatchToProps)(Search);
