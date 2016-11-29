import React, {Component} from 'react';
import { connect } from 'react-redux';

import { Row, Col } from 'react-flexbox-grid/lib/index';


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



  let signupBtnStyle = {
    color: 'white'
  }
  let googleBtnStyle = {
    color: 'white'
  }
  let facebookBtnStyle = {
    color: 'white'
  }
  let guestBtnStyle = {
    color: 'white'
  }

  return (
    <div id="login-grad">
      <Row>
        <Col xs={12}>
          <h1 id="login-title">weJay</h1>
          <Dialog
            actions={dialogActions}
            modal={false}
            open={showDialog}
            onRequestClose={clearError}
          >{ msg }
          </Dialog>
        </Col>
      </Row>
      <Row className="login-btn-container">
        <Col xs={8} xsOffset={2}>
          <RaisedButton
            secondary={true}
            label="Sign Up"
            onTouchTap={signUp}
            labelStyle={{
              fontSize: '1.3em',
              verticalAlign: 'middle',
              color: '#363836'
            }}
            buttonStyle={{
              height: '8vh',
              backgroundColor: 'white',
              color: 'black'
            }}
            overlayStyle={{
              height: '100%'
            }}
            fullWidth={true}
          />
          </Col>
        </Row>

        <Row>
          <Col sm={8} xsOffset={2}>
            { showSignup && <Signup firebase={firebase} renderError={renderError}/> }
          </Col>
        </Row>
        <Row className="login-btn-container">
          <Col xs={8} xsOffset={2}>
            <RaisedButton
              primary={true}
              label="Log In with Google"
              onTouchTap={() => {logIn('google')}}
              icon={<FontIcon className="zmdi zmdi-google" style={{fontSize: '2.5em'}}/>}
              labelStyle={{
                fontSize: '1em',
                verticalAlign: 'middle'

              }}
              buttonStyle={{
                height: '8vh',
                color: 'white'
              }}
              overlayStyle={{
                height: '100%'
              }}
              fullWidth={true}
            />
          </Col>
        </Row>
        <Row className="login-btn-container">
          <Col xs={8} xsOffset={2}>
            <RaisedButton
              primary={true}
              label="Log In with Facebook"
              onTouchTap={() => {logIn('facebook')}}
              icon={<FontIcon className="zmdi zmdi-facebook" style={{fontSize: '2.5em'}}/>}
              labelStyle={{
                fontSize: '1em',
                verticalAlign: 'middle',
                color: 'white'

              }}
              buttonStyle={{
                height: '8vh',
                backgroundColor: '#3B5998'
              }}
              overlayStyle={{
                height: '100%'
              }}
              fullWidth={true}
            />
            </Col>
          </Row>

          <Row>
            <Col xs={8} xsOffset={2}>
              <RaisedButton
                label="Continue As Guest"
                onTouchTap={anonymousSignIn}
                labelStyle={{
                  fontSize: '1.2em',
                  verticalAlign: 'middle',
                  color: '#363836'
                }}
                buttonStyle={{
                  height: '8vh',
                  backgroundColor: '#DAE2DF'
                }}
                overlayStyle={{
                  height: '100%'
                }}
                fullWidth={true}
              />
            </Col>
          </Row>
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
      .catch(this.renderError)
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
