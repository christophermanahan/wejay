import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Main extends Component {
  constructor(props) {
    super(props)

  }

  render() {
    return (
      <div>
        <h1>bones has been gutted.</h1>
      </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({  }) => ({ });
const mapDispatchToProps = () => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Main);
