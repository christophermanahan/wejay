import React, {Component} from 'react';
import { connect } from 'react-redux';


import {RaisedButton, TextField} from 'material-ui';
import {fetchTrackResults} from '../ducks/searchResults';
import injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbSearch = props => {
  const { onType, trackSearch } = props;
  return (
    <div>
        <TextField onChange={ onType }
             floatingLabelText="Search By Track"
           />
         <RaisedButton label="Search"  onTouchTap={ trackSearch }/>
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
  }

  onType(evt) {
    evt.preventDefault();
    let query = evt.target.value;
    this.setState({ query });
  }


  trackSearch(evt){
    const {tracksearch} = this.props
    const {query} = this.state
    tracksearch(query)
  }

  render() {

    return (
        <DumbSearch
          onType={ this.onType }
          trackSearch={ this.trackSearch }
        />
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

// const mapStateToProps = () => ();
const mapDispatchToProps = dispatch => ({
  tracksearch: (query) => dispatch(fetchTrackResults(query))
});

export default connect(null, mapDispatchToProps)(Search);
