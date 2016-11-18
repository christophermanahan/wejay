import React, {Component} from 'react';

import { connect } from 'react-redux';
import { Link } from 'react-router';

/* -----------------    COMPONENT     ------------------ */

class Chat extends Component {
  constructor(props) {
    super(props)

  }

  render() {

    return (
      <div>
        <h1>chat will be here</h1>
        <div>
          <div>
            <p>placeholder for messages</p>
          </div>
          <form>
            <input type="text" />
            <button type="submit">send message</button>
          </form>
          <button>sign in</button>
        </div>
      </div>
    )
  }
}

/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase }) => ({ firebase });
const mapDispatchToProps = () => ({ });

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
