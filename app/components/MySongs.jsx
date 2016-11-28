import React, {Component} from 'react';
import { connect } from 'react-redux';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbMySongs = props => {
  return (
    <div>
      <h2>I am the MySongs Component!</h2>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class MySongs extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <DumbMySongs
      />
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({  }) => ({  });


export default connect(mapStateToProps)(MySongs);
