import React, {Component} from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import Signup from './Signup';

/* -----------------    DUMB COMPONENT     ------------------ */

const DumbLogin = props => {

  const { anonymousSignIn, signUp, logIn, clearError, showDialog, msg, showSignup, firebase, renderError } = props;
  const dialogActions = [
    <FlatButton
      label="OK"
      primary={true}
      onTouchTap={clearError}
    />]

  return (
    <div>
      <h1 className="login-txt">WEJAY</h1>       
        <div>
          <Dialog
            actions={dialogActions}
            modal={false}
            open={showDialog}
            onRequestClose={clearError}
          >{ msg }
          </Dialog>
          <RaisedButton
            secondary={true}
            label="Sign Up"
            onTouchTap={signUp}
            className="login-btn"
            style={{display: "block"}}
          />
          { showSignup && <Signup firebase={firebase} renderError={renderError}/> }
          <RaisedButton
            primary={true}
            label="Log In with Google"
            onTouchTap={() => {logIn('google')}}
            className="login-btn"
            style={{display: "block"}}
            icon={<FontIcon className="zmdi zmdi-google" />}
          />
          <RaisedButton
            primary={true}
            label="Log In with Facebook"
            onTouchTap={() => {logIn('facebook')}}
            className="login-btn"
            style={{display: "block"}}
            icon={<FontIcon className="zmdi zmdi-facebook" />}
          />
          <Divider style={{ marginBottom: "50px" }} />
          <RaisedButton
            label="Continue As Guest"
            className="login-btn"
            style={{display: "block"}}
            onTouchTap={anonymousSignIn}
          />
        </div>
    </div>
  );
}

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */

class Login extends Component {
  constructor(props) {
    super(props);
    this.anonymousSignIn = this.anonymousSignIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
    this.setState = this.setState.bind(this);
    this.clearError = this.clearError.bind(this);
    this.renderError = this.renderError.bind(this);

    this.state = {
      error: {},
      showDialog: false,
      showSignup: false
    };
  }

  anonymousSignIn() {
    const { firebase } = this.props;

    firebase.auth().signInAnonymously()
      .then(something => {
        browserHistory.push('/app/chat')
      })
      .catch(console.error)
  }

  signUp() {
    const { firebase } = this.props;
    this.setState({ showSignup: !this.state.showSignup });
  }

  logIn(method) {
    const { firebase } = this.props;

    const myAuth = firebase.auth();
    let provider;

    if (method === 'google') {
      provider = new firebase.auth.GoogleAuthProvider();
    } else if (method === 'facebook') {
      provider = new firebase.auth.FacebookAuthProvider();
    }

    myAuth.signInWithPopup(provider)
    .catch(this.renderError);
  }

  renderError(err) {
    this.setState({error: err, showDialog: true});
  }

  clearError() {
    this.setState({error: {}, showDialog: false});
  }

  render() {
    return (
      <DumbLogin
        anonymousSignIn={ this.anonymousSignIn }
        signUp={ this.signUp }
        logIn={ this.logIn }
        clearError={ this.clearError }
        showDialog={ this.state.showDialog }
        msg={ this.state.error.message }
        showSignup={ this.state.showSignup }
        firebase={ this.props.firebase }
        renderError={ this.renderError }
      />
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user }) => ({ firebase, user });


export default connect(mapStateToProps, null)(Login);
