import React, {Component} from 'react';
import { connect } from 'react-redux';
import {RaisedButton, TextField} from 'material-ui';
import {fetchTrackResults} from '../ducks/searchResults';

import SearchResults from './SearchResults';

import { Row, Col } from 'react-flexbox-grid/lib/index';

import Snackbar from 'material-ui/Snackbar';

import IconButton from 'material-ui/IconButton';



const TextFieldStyle = {width: '60%'};
const RaisedButtonStyle = {width: '20%', marginLeft: '20px'};

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSearch = props => {
  const { onType, trackSearch, onClear, clearedVal } = props;
  return (
      <Row>
        <Col xs={12}>
          <form onSubmit={ trackSearch }>
            <Row>
              <Col xs={12}>
                <TextField
                  style={TextFieldStyle}
                  onChange={ onType }
                  floatingLabelText="Search By Track"
                  value={clearedVal}
                />

                <IconButton onTouchTap={onClear}>
                  <i className="material-icons">highlight_off</i>
                </IconButton>

                <RaisedButton
                  label="Search"
                  onTouchTap={ trackSearch }
                  style={RaisedButtonStyle}
                />
              </Col>
            </Row>
           </form>
        </Col>
      </Row>
  );
};


/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      query: '',
      snackbarOpen: false,
      songDestination: '',
      clearedVal: ''
    };

    this.onType = this.onType.bind(this);
    this.onClear = this.onClear.bind(this);
    this.trackSearch = this.trackSearch.bind(this);
    this.addToQueue = this.addToQueue.bind(this);
    this.openSnackbar = this.openSnackbar.bind(this);
    this.closeSnackbar = this.closeSnackbar.bind(this);

  }

  onClear(){
    console.log("CLICKED");
    this.setState({ clearedVal: '' })
  }

  onType(evt) {
    evt.preventDefault();
    let query = evt.target.value;
    this.setState({ query });
  }

  openSnackbar(songDestination) {
    this.setState({snackbarOpen: true, songDestination});
  }

  closeSnackbar() {
    this.setState({snackbarOpen: false, songDestination: ''})
  }


  trackSearch(evt){
    evt.preventDefault();
    const {tracksearch} = this.props;
    const {query} = this.state;
    if (!query.length) return;
    tracksearch(query);
  }

  addToQueue(song_uri, title, artist, artwork_url, duration) {
    const { user, currentParty, fireboss } = this.props;
    const partyId = currentParty.id;
    const { uid } = user;
    const { dj_name } = this.props.djs[uid];
    const song = { song_uri, title, artist, artwork_url, dj_name, time_priority: 0, vote_priority: 0, duration};

    fireboss.submitUserSong(partyId, user, song, this.openSnackbar)
  }

  render() {
    const { searchResults, clearedVal } = this.props;
    return (
        <div>
          <Row>
            <Col xs={10} xsOffset={1}>
              <DumbSearch
                clearedVal={clearedVal}
                onClear= { this.onClear }
                onType={ this.onType }
                trackSearch={ this.trackSearch }
              />
            </Col>
            <Col xs={8} xsOffset={2}>
              <Snackbar
                open={this.state.snackbarOpen}
                message={this.state.songDestination}
                autoHideDuration={4000}
                onRequestClose={this.closeSnackbar}
                contentStyle={{ fontSize: '1.2em' }}
                bodyStyle={{ height: '2.5em', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
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
