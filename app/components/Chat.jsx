import React, {Component} from 'react';

import { connect } from 'react-redux';
// import { Link } from 'react-router';

import { clearUser, setUser } from '../ducks/user';

import MessageList from './MessageList';


/* -----------------    DUMB COMPONENT     ------------------ */

const DumbChat = props => {
  const { txt, signOut, signIn, sendSwag, onType, messages, user } = props;
  return (
    <div>
      <h1>chat will be here</h1>
      <div>
        <div>
          <MessageList messages={ messages } />
        </div>
          <form>
            <input type="text" name="chattext" value={ txt } onChange={ onType }/>
            <button type="submit" onClick={ sendSwag }>Send Swag</button>
          </form>
        {
          user && user.displayName ?
          <span>Welcome, { user.displayName }
            <button onClick={ signOut }>sign out</button>
          </span>
          :
          <span><button onClick={ signIn }>sign in</button></span>
        }
      </div>
    </div>
  );
};

/* -----------------    STATEFUL REACT COMPONENT     ------------------ */


class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      txt: ''
    };

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.sendSwag = this.sendSwag.bind(this);
    this.onType = this.onType.bind(this);
  }

  signIn(evt) {
    evt.preventDefault();
    const { firebase, login } = this.props;
    const myAuth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();
    myAuth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        login(user);
      })
      .catch(err => console.error(err));
  }

  signOut(evt) {
    evt.preventDefault();
    const { firebase, logout } = this.props;
    firebase.auth().signOut()
      .then(() => {
        logout();
      })
      .catch(err => console.error(err));
  }

  sendSwag(evt) {
    evt.preventDefault();
    let timeStamp = Date.now() + '';
    const { messages, user, firebase } = this.props;
    const userName = user.displayName || 'anon';
    const messageText = this.state.txt;

    this.setState({txt: ''});
    const update = { [timeStamp]: { name: userName, text: messageText } };
    firebase.database().ref('messages').update(update);
  }

  onType(evt) {
    evt.preventDefault();
    let msgtxt = evt.target.value;
    this.setState({ txt: msgtxt });
  }


  render() {

    return (
      <DumbChat
        txt={ this.state.txt }
        signOut={ this.signOut }
        signIn={ this.signIn }
        sendSwag={ this.sendSwag }
        onType={ this.onType }
        messages={ this.props.messages }
        user={ this.props.user }
      />
    );
  }
}


/* -----------------    CONTAINER     ------------------ */

const mapStateToProps = ({ firebase, user, messages }) => ({ firebase, user, messages });
const mapDispatchToProps = dispatch => ({
  logout: () => dispatch(clearUser()),
  login: user => dispatch(setUser(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
