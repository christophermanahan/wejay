import React, {Component} from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

/* -----------------    COMPONENT     ------------------ */

class Login extends Component {
  constructor(props) {
    super(props);
    this.anonymousSignIn = this.anonymousSignIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  anonymousSignIn() {
    const { firebase } = this.props;

    firebase.auth().signInAnonymously()
      .then(something => {
        console.log('got anon!', something)
        browserHistory.push('/app/chat')
      })
      .catch(console.error)
  }

  signUp() {
    const { firebase } = this.props;
    console.log('trigger sign-up!');
    // TODO: create form for sign up
  }

  logIn() {
    const { firebase } = this.props;

    const myAuth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    myAuth.signInWithRedirect(provider)
    .then(() => { console.log('signed in!')})
    .catch(console.error);

  }

  render() {
    return (
        <div>
          <h1>WEJAY</h1>
            <div>
              <RaisedButton
              secondary={true}
              label="Sign Up"
              onTouchTap={this.signUp}
              />
              <RaisedButton
                primary={true}
                label="Log In with Google"
                onTouchTap={this.logIn}
              />
              <Divider />
              <RaisedButton
                label="Continue As Guest"
                onTouchTap={this.anonymousSignIn}
              />
            </div>
        </div>
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user }) => ({ firebase, user });
// const mapDispatchToProps = dispatch => ({
//   tracksearch: (query) => dispatch(fetchTrackResults(query))
// });

export default connect(mapStateToProps, null)(Login);
